# Face Recognition Pipeline — Implementation Plan

## Problem
SigLIP matches visual concepts ("man in suit", "people together") but can't identify **who** is in a photo. Searching "Karim with his friends" returns every photo with multiple people — including bride photos. Names are meaningless to SigLIP embeddings. This is a fundamental limitation that no amount of prompt tuning can fix.

## Solution
Add face detection + recognition + clustering + user labeling. Once the user labels face clusters ("this is Karim", "this is Doaa"), search queries like "Karim with his friends" can be filtered to photos containing Karim's face alongside other male faces.

---

## Architecture Overview

```
Current pipeline:
  Upload → Embed (SigLIP) → Caption (Florence-2) → Searchable

New pipeline:
  Upload → Embed (SigLIP) → Caption (Florence-2) → Face Detection (Florence-2)
                                                         ↓
                                                    Face Embedding (InsightFace, port 8003)
                                                         ↓
                                                    Auto-cluster → User labels faces
                                                         ↓
                                                    Face-aware search
```

Face detection runs after captioning (reuses the same Florence-2 service). Face embedding uses a new InsightFace service. Auto-clustering groups the same face across all photos. The user then names the clusters.

---

## Step 1: Extend Florence-2 with face detection endpoint

**File: `apps/florence-service/main.py`**

Add a new `/detect-faces` endpoint that uses Florence-2's `<OD>` task (object detection already available) but filters for "person"/"face" labels, returning bounding boxes. Florence-2's OD returns bounding boxes with labels — we extract face/person regions.

```python
# New endpoint
POST /detect-faces
Request:  { image_url: str }
Response: { faces: [{ bbox: [x1, y1, x2, y2], confidence: float }] }

POST /detect-faces/batch
Request:  { image_urls: list[str] }
Response: { results: [{ faces: [...] }] }
```

Florence-2 does NOT produce "face" labels directly from `<OD>`. Instead, we use the `<CAPTION_TO_PHRASE_GROUNDING>` task with the prompt "face" to locate face regions. This returns bounding boxes for each face detected.

No new dependencies — Florence-2 already supports this task.

---

## Step 2: Create InsightFace service (new Python service)

**New: `apps/face-service/`**

InsightFace (ArcFace) produces a 512-dimensional face embedding vector per face crop. Two faces of the same person have high cosine similarity (~0.5+), different people have low similarity.

```
Port: 8003
Model: buffalo_l (InsightFace default — ArcFace backbone, ~250 MB)
```

**Files:**
- `apps/face-service/main.py` — FastAPI service
- `apps/face-service/requirements.txt`
- `apps/face-service/Dockerfile`

**Endpoints:**
```
GET  /health
POST /embed-face        { image_url, bbox: [x1,y1,x2,y2] } → { embedding: float[512] }
POST /embed-face/batch  { items: [{ image_url, bbox }] }    → { embeddings: float[512][] }
```

The service:
1. Downloads the image
2. Crops to the bounding box (from Florence-2 face detection)
3. Runs InsightFace to get a 512-dim face embedding
4. Returns the normalized embedding

**Dependencies:** `insightface`, `onnxruntime` (CPU) or `onnxruntime-gpu`, `numpy`, `opencv-python-headless`, plus the same FastAPI/httpx/torch stack.

---

## Step 3: Database schema changes

**File: `apps/image-search-service/scripts/db-deploy.cjs`** — add new tables:

### Table: `image_search_face`
Stores each detected face in a photo.

```sql
CREATE TABLE IF NOT EXISTS "image_search_face" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "photoId" TEXT NOT NULL,          -- FK to image_search_image.photoId
  "galleryId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bbox" JSONB NOT NULL,            -- [x1, y1, x2, y2] normalized 0-1
  "embedding" vector(512) NOT NULL, -- ArcFace embedding
  "clusterId" TEXT,                 -- FK to image_search_face_cluster.id
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "image_search_face_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "image_search_face_photoId_idx" ON "image_search_face"("photoId");
CREATE INDEX "image_search_face_galleryId_userId_idx" ON "image_search_face"("galleryId", "userId");
CREATE INDEX "image_search_face_clusterId_idx" ON "image_search_face"("clusterId");
CREATE INDEX "image_search_face_embedding_idx" ON "image_search_face"
  USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);
```

### Table: `image_search_face_cluster`
Groups faces of the same person together. User assigns a label.

```sql
CREATE TABLE IF NOT EXISTS "image_search_face_cluster" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "galleryId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "label" TEXT,                     -- User-assigned name ("Karim", "Doaa")
  "representativeFaceId" TEXT,      -- Best face crop for display
  "faceCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "image_search_face_cluster_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "image_search_face_cluster_galleryId_userId_idx"
  ON "image_search_face_cluster"("galleryId", "userId");
```

### Column on `image_search_image`
```sql
ALTER TABLE "image_search_image"
  ADD COLUMN IF NOT EXISTS "facesDetectedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "faceDetectionAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "faceDetectionError" TEXT;
```

---

## Step 4: Face detection + embedding pipeline in image-search-service

### New files in `apps/image-search-service/src/`:

**`services/face.service.ts`** — orchestrates face detection + embedding:
1. Query photos where `facesDetectedAt IS NULL` and `captionedAt IS NOT NULL` and `faceDetectionAttempts < 3`
2. For each photo: call Florence-2 `/detect-faces` → get bounding boxes
3. For each bbox: call face-service `/embed-face` → get 512-dim embedding
4. Insert face records into `image_search_face`
5. Update `image_search_image.facesDetectedAt`
6. Trigger auto-clustering for the gallery

**`services/face-cluster.service.ts`** — auto-clusters faces within a gallery:
1. Load all face embeddings for the gallery
2. If no clusters exist: run greedy clustering (cosine similarity threshold ~0.55)
3. If clusters exist: assign new unassigned faces to nearest cluster or create new cluster
4. Pick representative face per cluster (highest quality / most centered bbox)
5. Update `image_search_face.clusterId` and `image_search_face_cluster.faceCount`

**`services/face.client.ts`** — HTTP client for the face-service (same pattern as `siglip.client.ts` and `florence.client.ts`)

**`queues/face-detection.queue.ts`** — BullMQ worker (same pattern as captioning queue):
- Triggered after captioning completes
- Job data: `{ galleryId }`
- Calls `processFaceDetection(galleryId)`
- Can be disabled via `FACE_DETECTION_ENABLED` env var

### Modified files:

**`queues/captioning.queue.ts`** — after captioning completes, enqueue face detection job

**`constants/env.ts`** — add:
```
FACE_SERVICE_URL: 'http://localhost:8003'
FACE_DETECTION_ENABLED: true
FACE_DETECTION_WORKER_CONCURRENCY: 2
FACE_CLUSTER_THRESHOLD: 0.55
```

**`bootstrap.ts`** — start/stop face detection worker

**`routes/index.ts`** — register face routes

---

## Step 5: Face management API routes

### In `apps/image-search-service/`:

**`routes/face.routes.ts`** + **`controllers/face.controller.ts`**:

```
GET  /faces/:galleryId/clusters       → list face clusters with representative face thumbnails
POST /faces/:galleryId/clusters/:id/label  → set cluster label { label: "Karim" }
POST /faces/:galleryId/clusters/merge  → merge two clusters { sourceId, targetId }
GET  /faces/:galleryId/photo/:photoId  → get faces detected in a specific photo
```

### In `apps/backend/`:

Proxy these through the backend with auth (same pattern as gallery-ai-status):
```
GET  /dashboard/galleries/:id/ai/faces         → list face clusters
POST /dashboard/galleries/:id/ai/faces/:clusterId/label  → label a cluster
POST /dashboard/galleries/:id/ai/faces/merge   → merge clusters
```

### In `apps/dashboard/`:

Next.js API route proxies:
```
apps/dashboard/app/api/galleries/[id]/ai/faces/route.ts
apps/dashboard/app/api/galleries/[id]/ai/faces/[clusterId]/label/route.ts
apps/dashboard/app/api/galleries/[id]/ai/faces/merge/route.ts
```

---

## Step 6: Face-aware search

**File: `apps/image-search-service/src/services/search.service.ts`**

When searching, if any face cluster labels match words in the query:
1. Extract known face labels from the gallery's clusters
2. Check if query contains any label names (e.g. "Karim" matches cluster labeled "Karim")
3. If matched: filter results to photos containing that person's face cluster
4. Combine face filtering with existing vector + text search

```typescript
// In searchPhotos():
// 1. Load labeled clusters for this gallery
// 2. Check if prompt words match any cluster labels
// 3. If matches found, add WHERE clause: photoId IN (SELECT photoId FROM image_search_face WHERE clusterId = $X)
// 4. This intersects with the existing vector/text search results
```

This means "Karim with his friends" would:
1. Find cluster labeled "Karim" → get his clusterId
2. Get all photoIds where Karim's face appears
3. Run normal search for "with his friends" (vector + text)
4. Intersect: only return photos from step 2 that also match step 3

---

## Step 7: Face labeling UI in the AI tab

**File: `apps/dashboard/components/dashboard/gallery-ai-tab.tsx`**

Add a faces section between the context card and the search UI (State C):

### Face clusters display:
- Horizontal scrollable row of face circle thumbnails (like Google Photos)
- Each shows the representative face crop + label (or "Unknown" if unlabeled)
- Click to open a dialog showing:
  - All photos containing this face (grid)
  - Text input to set/edit the name
  - Option to merge with another cluster
- Face thumbnails generated from bbox crops of photo thumbnails

### Face crop thumbnails:
The face service returns bounding boxes. We crop the existing photo thumbnail URLs client-side using CSS `object-fit` + `object-position`, or we generate face crop URLs server-side. Simplest approach: CSS cropping using the bbox coordinates on existing thumbnail URLs.

---

## Step 8: Face crop thumbnail generation

To display face thumbnails in the UI, we need cropped face images. Two options:

**Option A (simpler — CSS cropping):** Use the existing photo thumbnail URL with CSS `object-fit: cover` and `object-position` calculated from bbox. No new image processing needed, but faces may look odd at non-square aspect ratios.

**Option B (better — server-side crops):** Generate a small face thumbnail (e.g. 96x96 WebP) when a face is detected and store in S3. More work but cleaner display.

**Recommendation: Option A first** (CSS crops), upgrade to Option B later if needed.

---

## File Summary

### Files to create:
- `apps/face-service/main.py` — InsightFace Python service
- `apps/face-service/requirements.txt`
- `apps/face-service/Dockerfile`
- `apps/image-search-service/src/services/face.service.ts` — face detection orchestrator
- `apps/image-search-service/src/services/face-cluster.service.ts` — clustering logic
- `apps/image-search-service/src/services/face.client.ts` — HTTP client for face-service
- `apps/image-search-service/src/queues/face-detection.queue.ts` — BullMQ worker
- `apps/image-search-service/src/routes/face.routes.ts` — API routes
- `apps/image-search-service/src/controllers/face.controller.ts` — route handlers
- `apps/backend/src/services/DashboardServices/getGalleryFaces.ts` — backend proxy
- `apps/backend/src/services/DashboardServices/labelFaceCluster.ts`
- `apps/backend/src/services/DashboardServices/mergeFaceClusters.ts`
- `apps/dashboard/app/api/galleries/[id]/ai/faces/route.ts` — Next.js proxy
- `apps/dashboard/app/api/galleries/[id]/ai/faces/[clusterId]/label/route.ts`
- `apps/dashboard/app/api/galleries/[id]/ai/faces/merge/route.ts`

### Files to modify:
- `apps/florence-service/main.py` — add `/detect-faces` endpoint
- `apps/image-search-service/scripts/db-deploy.cjs` — add face tables
- `apps/image-search-service/src/constants/env.ts` — add face env vars
- `apps/image-search-service/src/bootstrap.ts` — start face worker
- `apps/image-search-service/src/routes/index.ts` — register face routes
- `apps/image-search-service/src/queues/captioning.queue.ts` — trigger face detection after captioning
- `apps/image-search-service/src/services/search.service.ts` — face-aware search filtering
- `apps/backend/src/controllers/DashboardController.ts` — face controllers
- `apps/backend/src/routes/dashboardRoutes.ts` — face routes
- `apps/backend/src/services/DashboardServices/index.ts` — exports
- `apps/dashboard/components/dashboard/gallery-ai-tab.tsx` — face labeling UI

---

## Implementation Order

1. **Florence-2 `/detect-faces` endpoint** — extend existing Python service
2. **Face service (InsightFace)** — new Python service at port 8003
3. **DB schema** — add face tables and tracking columns
4. **Face detection + embedding pipeline** — service, client, queue
5. **Auto-clustering** — cluster service
6. **Face management API** — routes in image-search-service + backend proxy + dashboard proxy
7. **Face-aware search** — modify search.service.ts
8. **Face labeling UI** — update gallery-ai-tab.tsx

---

## Verification

1. Upload photos → embedding → captioning → face detection should run automatically
2. Check face clusters API → should see auto-grouped face clusters
3. Label clusters → names persist
4. Search "Karim with his friends" → only returns photos with Karim's face + other people
5. Search "Doaa alone" → only returns photos with Doaa's face and no other faces
6. Merge two clusters of same person → both sets of photos appear under one label
