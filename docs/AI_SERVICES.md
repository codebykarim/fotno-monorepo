# AI Services Architecture

## Overview

Three services work together to make every uploaded photo searchable by natural language:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                    ┌──────────────────────────┐                            │
│                    │   image-search-service   │                            │
│                    │       (port 4002)        │                            │
│                    │                          │                            │
│                    │   The Orchestrator       │                            │
│                    │   ─────────────────      │                            │
│                    │   • Ingests photos       │                            │
│                    │   • Manages queues       │                            │
│                    │   • Clusters photos      │                            │
│                    │   • Caches captions      │                            │
│                    │   • Serves search        │                            │
│                    │   • Syncs to main DB     │                            │
│                    └──────┬──────────┬────────┘                            │
│                           │          │                                     │
│              calls        │          │        calls                        │
│            embedding      │          │      captioning                     │
│                           │          │                                     │
│                    ┌──────▼──┐  ┌────▼──────┐                              │
│                    │ SigLIP  │  │Florence-2 │                              │
│                    │ (8001)  │  │  (8002)   │                              │
│                    │         │  │           │                              │
│                    │ Image → │  │ Image →   │                              │
│                    │ Numbers │  │ Words     │                              │
│                    └─────────┘  └───────────┘                              │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SigLIP Service (port 8001)

**Model:** `google/siglip-so400m-patch14-384`
**Language:** Python (FastAPI)
**Purpose:** Turns images and text into numbers (embeddings)

SigLIP does one thing: it converts images and text into **1152-dimensional vectors**. It has no understanding of what's *in* a photo. It produces a mathematical fingerprint where visually/semantically similar things are close together in vector space.

The key property: images and text live in the **same vector space**. A photo of a sunset and the text "beautiful sunset" will produce vectors that are close to each other. This is what makes "search by description" possible.

### Endpoints

| Endpoint | Input | Output |
|----------|-------|--------|
| `POST /embed-image` | `{ image_url }` | `{ embedding: [1152 floats] }` |
| `POST /embed-image/batch` | `{ image_urls[] }` | `{ embeddings: [[1152 floats], ...] }` |
| `POST /embed-text` | `{ text }` | `{ embedding: [1152 floats] }` |
| `POST /embed-text/batch` | `{ texts[] }` | `{ embeddings: [[1152 floats], ...] }` |
| `GET /health` | — | `{ status, model, device, embedding_dim }` |

### How It Works

```
                         SigLIP Model
                    ┌─────────────────────┐
                    │                     │
   Photo of a      │   Shared Vector     │     [0.12, -0.45, 0.78, ...]
   dog playing  ──▶│      Space          │──▶  1152 numbers
                    │                     │
   "playful dog    │   Images & text     │     [0.11, -0.43, 0.80, ...]
    in park"    ──▶│   map to same      │──▶  1152 numbers (similar!)
                    │   space             │
                    └─────────────────────┘
```

These vectors are stored in PostgreSQL with pgvector. At search time, the user's text query is also embedded, and we find photos whose vectors are closest (cosine distance).

### Config

| Env Var | Default | Description |
|---------|---------|-------------|
| `SIGLIP_SERVICE_PORT` | `8001` | Port |
| `MAX_BATCH_SIZE` | `32` | Max images per batch request |

---

## Florence-2 Service (port 8002)

**Model:** `microsoft/Florence-2-large`
**Language:** Python (FastAPI)
**Purpose:** Looks at photos and describes what's in them

Florence-2 is a vision-language model. For each image it runs **two tasks**:

1. **`<MORE_DETAILED_CAPTION>`** — generates a descriptive sentence
   *"A bride and groom standing under a floral arch in a garden ceremony"*

2. **`<OD>` (object detection)** — extracts object labels as tags
   `["person", "dress", "flowers", "arch"]`

### Endpoints

| Endpoint | Input | Output |
|----------|-------|--------|
| `POST /caption` | `{ image_url }` | `{ caption: string, tags: string[] }` |
| `POST /caption/batch` | `{ image_urls[] }` | `{ results: [{ caption, tags }, ...] }` |
| `GET /health` | — | `{ status, model, device }` |

### Why Both SigLIP AND Florence-2?

They solve different problems:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   SigLIP (embeddings) answers: "Which photos LOOK like this?"   │
│                                                                  │
│     "sunset" → finds photos that visually resemble sunsets       │
│     Works even on uncaptioned photos                             │
│     Fast similarity matching via pgvector                        │
│     BUT: can't match on specific words/names                     │
│                                                                  │
│   Florence-2 (captions) answers: "What IS in this photo?"       │
│                                                                  │
│     Enables keyword search: "cake" matches "a wedding cake       │
│     decorated with white frosting"                               │
│     Gives LLM context for smart album suggestions                │
│     BUT: requires processing time per photo                      │
│                                                                  │
│   Together: Hybrid search (70% text rank + 30% vector sim)      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Config

| Env Var | Default | Description |
|---------|---------|-------------|
| `FLORENCE_SERVICE_PORT` | `8002` | Port |
| `MAX_BATCH_SIZE` | `16` | Max images per batch request |

---

## Image Search Service (port 4002)

**Language:** Node.js / Express / TypeScript
**Database:** PostgreSQL with pgvector extension (separate from main DB)
**Queue:** BullMQ (Redis)
**Purpose:** Orchestrates SigLIP + Florence-2 into a search pipeline

This is the brain. SigLIP and Florence-2 are stateless inference endpoints — they take an image and return results. The image-search-service manages everything around them: queuing, batching, clustering, caching, error handling, retries, and serving search queries.

### What It Does

```
┌───────────────────────────────────────────────────────────────────────────┐
│  image-search-service responsibilities                                   │
│                                                                          │
│  1. INGEST ──────────────────────────────────────────────────────────    │
│     Receives photos from upload-service after processing                 │
│     Creates records in pgvector DB                                       │
│     Enqueues embedding jobs                                              │
│                                                                          │
│  2. EMBED ───────────────────────────────────────────────────────────    │
│     BullMQ worker batches photos                                         │
│     Calls SigLIP /embed-image/batch                                      │
│     Stores 1152-dim vectors in pgvector                                  │
│     Auto-triggers captioning when done                                   │
│                                                                          │
│  3. CAPTION ─────────────────────────────────────────────────────────    │
│     BullMQ worker fetches embedded-but-uncaptioned photos                │
│     Clusters similar photos (cosine sim > 0.93)                          │
│       → captions only 1 per cluster (saves Florence-2 calls)             │
│     Checks caption library cache first                                   │
│       → reuses if similar image was already captioned                    │
│     Calls Florence-2 /caption for new images                             │
│     Syncs aiCaption + aiTags back to main Prisma Photo model             │
│                                                                          │
│  4. SEARCH ──────────────────────────────────────────────────────────    │
│     Receives search queries from backend                                 │
│     Strategy 1: LLM search (if gallery has AI context)                   │
│       → sends captions to LLM for semantic understanding                 │
│       → handles names, roles, exclusion ("only the bride")               │
│     Strategy 2: Hybrid text + vector (default)                           │
│       → 70% full-text rank on captions                                   │
│       → 30% vector cosine similarity                                     │
│     Strategy 3: Vector-only (fallback)                                   │
│       → pure embedding distance                                          │
│                                                                          │
│  5. ALBUM SUGGESTION ────────────────────────────────────────────────    │
│     Takes a prompt like "ceremony photos"                                │
│     Finds matching photos via search                                     │
│     Returns grouped as album with title/description                      │
│                                                                          │
└───────────────────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ingest-photo` | POST | Receive photo from upload service |
| `/search` | POST | Search photos by text prompt |
| `/suggest-album` | POST | AI album suggestion |
| `/caption-backfill` | POST | Manually trigger captioning for a gallery |
| `/caption-library/stats` | GET | Caption cache statistics |
| `/gallery-status/:id` | GET | Processing progress (total/embedded/captioned) |
| `/health` | GET | Service health check |

### The Pipeline

```
upload-service                image-search-service
─────────────                ─────────────────────

Photo processed ──POST──▶  /ingest-photo
                                  │
                                  ▼
                           image_search_image record created
                           (embedding: NULL, caption: NULL)
                                  │
                                  ▼
                           ┌─────────────────┐
                           │ Embedding Queue  │
                           │   (BullMQ)       │
                           └────────┬─────────┘
                                    │
                                    ▼
                           Fetch batch WHERE embedding IS NULL
                                    │
                                    ▼
                           ┌─────────────────┐
                           │ SigLIP Service   │──▶ 1152-dim vector
                           │ /embed-image     │
                           └────────┬─────────┘
                                    │
                                    ▼
                           Store embedding + indexedAt
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ Captioning Queue  │
                           │   (BullMQ)        │
                           └────────┬──────────┘
                                    │
                                    ▼
                           Cluster similar photos
                           (skip near-duplicates)
                                    │
                           ┌────────┴────────┐
                           │                 │
                      Cache hit?         Cache miss
                           │                 │
                           ▼                 ▼
                      Reuse caption   ┌───────────────┐
                      from library    │Florence-2      │
                                      │/caption        │──▶ { caption, tags }
                                      └───────┬────────┘
                                              │
                                              ▼
                                     Save to caption library
                                              │
                           ┌──────────────────┘
                           │
                           ▼
                   Store caption + tags in pgvector DB
                           │
                           ▼
                   Sync aiCaption + aiTags to main Photo table
                           │
                           ▼
                   ✅ Photo is fully searchable
```

### Search Flow

```
User types "bride and groom under the arch"
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Has gallery AI context + LLM configured?                   │
│                                                             │
│  YES ──▶ LLM Search                                        │
│          │                                                  │
│          ├── Small gallery (≤200 photos):                   │
│          │     Send ALL captions to LLM                     │
│          │                                                  │
│          └── Large gallery (>200 photos):                   │
│                Pre-filter with vector search                │
│                Send top candidates' captions to LLM         │
│          │                                                  │
│          └── LLM returns ordered photoIds                   │
│                                                             │
│  NO ──▶ Hybrid Search                                       │
│          │                                                  │
│          ├── Embed query text via SigLIP                    │
│          │                                                  │
│          ├── Full-text search on captions (ts_rank) × 0.7   │
│          │   + Vector similarity (cosine)            × 0.3  │
│          │                                                  │
│          └── If no text matches: vector-only fallback       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
       Return matching photoIds + scores
```

### Optimizations

**Clustering** — When a photographer uploads 50 similar ceremony shots, they look nearly identical to the model. Instead of captioning all 50, the service groups them by cosine similarity (threshold ~0.93) and only captions one representative per cluster. The rest inherit the same caption. This can reduce Florence-2 calls by 60-80%.

**Caption Library** — A persistent cache of embedding→caption mappings. Before calling Florence-2, the service checks if a visually similar image has already been captioned. If the cosine similarity exceeds the threshold, it reuses the cached caption. This helps across galleries (e.g., a photographer who shoots similar venues).

**Retry Budgets** — Each photo gets 3 embedding attempts and 3 captioning attempts. After exhausting retries, the photo is left in its current state (vector-searchable but not text-searchable, or not searchable at all). Failed photos can be retried by resetting their attempt counters.

### Database (pgvector)

The image-search-service uses its own PostgreSQL database with the pgvector extension, separate from the main application database.

```sql
-- Core table
image_search_image
  ├── photoId (links to main DB Photo.id)
  ├── embedding vector(1152)     -- from SigLIP
  ├── caption text               -- from Florence-2
  ├── tags text[]                -- from Florence-2
  ├── captionTsv tsvector        -- auto-generated for full-text search
  ├── captionSource              -- "library" | "florence2" | "florence2-cluster"
  ├── embeddingAttempts / Error   -- retry tracking
  └── captionAttempts / Error     -- retry tracking

-- Caption cache
caption_library
  ├── embedding vector(1152)     -- lookup key
  ├── caption text
  ├── tags text[]
  └── usageCount                 -- how many times reused

-- Album suggestion cache
image_search_album_cache
  ├── galleryId + userId + normalizedPrompt  -- cache key
  ├── photoIds text[]
  └── expiresAt                              -- TTL
```
