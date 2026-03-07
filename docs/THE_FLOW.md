# The Flow: Photo Upload to Searchable

## High-Level Pipeline

```
User Upload → S3 Multipart → Image Processing → Search Ingestion → Embedding → Captioning → Searchable
```

Each arrow is async. The user only waits for the first step (S3 upload). Everything else happens in background workers.

---

## Detailed Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: UPLOAD (upload-service, port 3010)                              │
│                                                                           │
│  User selects photos in UI                                                │
│         │                                                                 │
│         ▼                                                                 │
│  POST /batch-init                                                         │
│    ├── Validate gallery ownership                                         │
│    ├── Deduplicate by checksum (skip already-uploaded files)               │
│    ├── Check storage quota                                                │
│    ├── Create Photo records (status: "pending")                           │
│    ├── Create UploadSession (status: "IN_PROGRESS")                       │
│    ├── Init S3 multipart uploads                                          │
│    └── Return presigned URLs to client                                    │
│         │                                                                 │
│         ▼                                                                 │
│  Client uploads chunks directly to S3 (PUT presigned URLs)                │
│         │                                                                 │
│         ▼                                                                 │
│  POST /confirm                                                            │
│    ├── Verify all parts uploaded                                          │
│    ├── Complete S3 multipart                                              │
│    ├── Photo.status → "uploaded"                                          │
│    ├── UploadSession.status → "COMPLETED"                                 │
│    └── Enqueue BullMQ job: "process-photo"                                │
│                                                                           │
│  ════════════════════════════════════════════════════════════              │
│  USER IS DONE HERE. Everything below is background.                       │
│  ════════════════════════════════════════════════════════════              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: IMAGE PROCESSING (upload-service worker OR image-processor)     │
│                                                                           │
│  BullMQ worker picks up "process-photo" job                               │
│         │                                                                 │
│         ▼                                                                 │
│  Photo.status → "processing"                                              │
│         │                                                                 │
│         ├── Download original from S3                                     │
│         ├── Generate thumbnail (≤250KB WebP)                              │
│         ├── Generate preview (≤1MB WebP)                                  │
│         ├── Extract width/height                                          │
│         ├── Upload thumbnail + preview to S3                              │
│         │                                                                 │
│         ▼                                                                 │
│  Photo.status → "processed"                                               │
│  Photo.processedAt = now                                                  │
│  Photo.thumbnailKey, previewKey, width, height set                        │
│         │                                                                 │
│         ▼                                                                 │
│  POST image-search-service/ingest-photo  ◄── FIRE AND FORGET             │
│    { photoId, userId, galleryId, storageUrl }                             │
│         │                                                                 │
│         │  ⚠️  If this HTTP call fails, the photo is "processed"          │
│         │     but NEVER enters the search pipeline. Silent failure.       │
│         │                                                                 │
│  On error: Photo.status → "failed" (only if processing itself fails)     │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: SEARCH INGESTION (image-search-service, port 4002)              │
│                                                                           │
│  POST /ingest-photo                                                       │
│         │                                                                 │
│         ▼                                                                 │
│  Upsert image_search_image record                                         │
│    ├── embedding: NULL                                                    │
│    ├── indexedAt: NULL                                                    │
│    ├── caption: NULL                                                      │
│    ├── captionedAt: NULL                                                  │
│    └── tags: []                                                           │
│         │                                                                 │
│         ▼                                                                 │
│  Enqueue BullMQ job: "embedding-queue"                                    │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: EMBEDDING (image-search-service worker → SigLIP, port 8001)     │
│                                                                           │
│  BullMQ worker picks up embedding job                                     │
│         │                                                                 │
│         ▼                                                                 │
│  Fetch batch of photos WHERE embedding IS NULL                            │
│         │                                                                 │
│         ├── Get presigned URLs for each photo                             │
│         ├── POST siglip-service/embed-image/batch                         │
│         │     → Returns 1152-dim vectors                                  │
│         │                                                                 │
│         ▼                                                                 │
│  UPDATE image_search_image                                                │
│    SET embedding = [...], indexedAt = NOW()                                │
│         │                                                                 │
│         │  ⚠️  If SigLIP is down or fails, embedding stays NULL.          │
│         │     Photo exists in DB but is NOT searchable. Silent failure.   │
│         │                                                                 │
│         ▼                                                                 │
│  Enqueue BullMQ job: "captioning-queue" (per gallery, 30s delay)          │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5: CAPTIONING (image-search-service → Qwen2-VL, port 8002)       │
│                                                                           │
│  BullMQ worker picks up captioning job                                    │
│         │                                                                 │
│         ▼                                                                 │
│  Fetch photos WHERE embedding IS NOT NULL AND captionedAt IS NULL         │
│         │                                                                 │
│         ▼                                                                 │
│  Cluster similar photos by cosine similarity (threshold ~0.93)            │
│    └── Caption only 1 representative per cluster                          │
│         │                                                                 │
│         ▼                                                                 │
│  For each cluster:                                                        │
│    ├── Check caption library (cached captions for similar images)         │
│    │     └── If match → reuse caption (source: "library")                 │
│    │                                                                      │
│    └── If no library match:                                               │
│          ├── Get presigned URL for representative                         │
│          ├── POST qwen2vl-service/caption                                 │
│          │     → Returns { caption, tags }                                │
│          ├── Save to caption library for future reuse                     │
│          └── source: "qwen2vl" or "qwen2vl-cluster"                    │
│         │                                                                 │
│         ▼                                                                 │
│  UPDATE image_search_image                                                │
│    SET caption, tags, captionedAt = NOW(), captionSource                  │
│                                                                           │
│  UPDATE Photo (main DB, non-fatal)                                        │
│    SET aiCaption, aiTags                                                  │
│         │                                                                 │
│         │  ⚠️  If Qwen2-VL is down, caption stays NULL.                 │
│         │     Photo IS searchable by vector, but NOT by text.             │
│         │     Fails silently per-cluster, continues with others.          │
│         │                                                                 │
│         ▼                                                                 │
│  ✅ PHOTO IS FULLY SEARCHABLE                                             │
│     (vector search works after Phase 4, text search after Phase 5)        │
└─────────────────────────────────────────────────────────────────────────────┘

---

## Search Query Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SEARCH (image-search-service, port 4002)                                 │
│                                                                           │
│  POST /search { userId, galleryId, prompt, limit }                        │
│         │                                                                 │
│         ▼                                                                 │
│  Embed the prompt text → POST siglip-service/embed-text                   │
│         │                                                                 │
│         ▼                                                                 │
│  Hybrid Search (if prompt has meaningful keywords):                       │
│    ├── Full-text search on captionTsv (PostgreSQL ts_rank)  → 70% weight  │
│    └── Vector similarity (pgvector cosine distance)         → 30% weight  │
│         │                                                                 │
│         ▼                                                                 │
│  Fallback (if no text hits or only stopwords):                            │
│    └── Vector-only search (1 - cosine_distance as score)                  │
│         │                                                                 │
│         ▼                                                                 │
│  Return { photoIds, scores }                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## State Machine: Photo.status

```
  "pending"  ──upload──▶  "uploaded"  ──worker──▶  "processing"
                                                       │
                                              ┌────────┴────────┐
                                              ▼                 ▼
                                         "processed"        "failed"
```

## State Machine: image_search_image

```
  Created              Embedded              Captioned
  ┌──────┐            ┌──────────┐          ┌────────────┐
  │ emb  │  SigLIP    │ emb SET  │ Florence │ caption SET│
  │ NULL │──────────▶ │ indexed  │────────▶ │ captioned  │
  │ cap  │            │ cap NULL │          │ tags SET   │
  │ NULL │            │          │          │            │
  └──────┘            └──────────┘          └────────────┘
  Not searchable      Vector-searchable     Fully searchable
                                            (text + vector)
```

---

## Failure Handling

| Phase | What fails | Mitigation | How to check |
|-------|-----------|------------|--------------|
| 2 → 3 | Ingest HTTP call | Retries 3x with backoff. Logs error on final failure. | Check upload-service logs for "ingest failed after 3 attempts" |
| 4 | SigLIP down/error | Tries batch first, falls back to per-image. Tracks `embeddingAttempts` + `embeddingError`. Gives up after 3 attempts per image. | `SELECT * FROM image_search_image WHERE "embeddingAttempts" >= 3` |
| 5 | Qwen2-VL down/error | Tracks `captionAttempts` + `captionError` per cluster. Gives up after 3 attempts. Photo still vector-searchable. | `SELECT * FROM image_search_image WHERE "captionAttempts" >= 3` |
| 5 | Prisma sync to Photo | Non-fatal, logged as warning. Captions still work in search. | Check image-search-service logs for "Failed to sync captions" |

### Useful Diagnostic Queries

```sql
-- Photos stuck without embedding (gave up)
SELECT "photoId", "galleryId", "embeddingError", "embeddingAttempts", "createdAt"
FROM image_search_image
WHERE embedding IS NULL AND "embeddingAttempts" >= 3;

-- Photos stuck without caption (gave up)
SELECT "photoId", "galleryId", "captionError", "captionAttempts", "createdAt"
FROM image_search_image
WHERE "captionedAt" IS NULL AND "captionAttempts" >= 3;

-- Photos that were ingested but not yet embedded (still in queue)
SELECT COUNT(*) FROM image_search_image WHERE embedding IS NULL AND "embeddingAttempts" < 3;

-- Photos embedded but not yet captioned (still in queue)
SELECT COUNT(*) FROM image_search_image WHERE embedding IS NOT NULL AND "captionedAt" IS NULL AND "captionAttempts" < 3;

-- Photos processed in main DB but never ingested to search
SELECT p.id, p."galleryId", p.status
FROM "Photo" p
LEFT JOIN image_search_image isi ON isi."photoId" = p.id
WHERE p.status = 'processed' AND isi.id IS NULL;
-- (Run this against main DB, not pgvector DB — requires cross-DB check)

-- Reset failed photos to retry
UPDATE image_search_image SET "embeddingAttempts" = 0, "embeddingError" = NULL WHERE "embeddingAttempts" >= 3;
UPDATE image_search_image SET "captionAttempts" = 0, "captionError" = NULL WHERE "captionAttempts" >= 3;
```
