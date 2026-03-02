# Fotno — Running & Validation Guide

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 20 | https://nodejs.org |
| pnpm | 9.12.3 | `npm i -g pnpm@9.12.3` |
| Python | ≥ 3.11 | https://python.org |
| Redis | any | `brew install redis` |
| PostgreSQL | two instances (5433 + 5466) | managed / hosted |

---

## 1. First-Time Setup

```bash
# 1. Install all Node.js dependencies
pnpm install

# 2. Generate Prisma client (main DB)
pnpm db:generate

# 3. Run all database migrations against main DB (DIRECT_URL)
pnpm db:deploy

# 4. Set up the Python SigLIP service (uses a virtual environment)
cd apps/siglip-service
python3 -m venv .venv        # one-time: create venv
source .venv/bin/activate    # activate it (use each time you open a new terminal)
pip install -r requirements.txt
cd ../..
```

> The pgvector DB (`DATABASE_URL`, port 5466) migration runs automatically via
> `packages/db/prisma/migrations/20260302000000_add_image_search_pgvector/migration.sql`
> when you run `pnpm db:deploy`.

---

## 2. Service Start Order

Services must start in this order because of dependencies:

```
Redis → SigLIP → Image Search Service → Upload Service → Image Processor → Backend → Frontends
```

### Step 1 — Redis

```bash
redis-server
```

Validate:
```bash
redis-cli ping
# Expected: PONG
```

---

### Step 2 — SigLIP Inference Service (Python)

```bash
cd apps/siglip-service
source .venv/bin/activate   # activate the venv (created during first-time setup)
python main.py
```

- Runs on port **8001**
- First start downloads `google/siglip-so400m-patch14-384` (~1.7 GB) — this is a one-time download
- Device auto-detected: CUDA > MPS > CPU

Validate:
```bash
curl http://localhost:8001/health
# Expected: {"status":"ok","model":"google/siglip-so400m-patch14-384","device":"cpu|mps|cuda"}
```

---

### Step 3 — Image Search Service

```bash
cd apps/image-search-service
pnpm dev
```

- Runs on port **4002**
- Connects to pgvector DB (`DATABASE_URL`, port 5466)
- Connects to Redis for the embedding job queue

Validate:
```bash
curl http://localhost:4002/health
# Expected: {"status":"ok","db":"connected","siglip":"reachable"}
```

---

### Step 4 — Upload Service

```bash
cd apps/upload-service
pnpm dev
```

- Runs on port **3010**
- Connects to main DB and Redis
- Handles chunked S3 multipart uploads

Validate:
```bash
curl http://localhost:3010/health
# Expected: {"status":"ok","db":"connected","redis":"connected","s3":"connected"}
```

---

### Step 5 — Image Processor

```bash
pnpm dev:image-processor
# or from the app directory:
cd apps/image-processor
pnpm dev
```

- No HTTP port — it's a polling worker (polls every 3 s by default)
- Watches for uploaded photos → compresses → uploads to R2 → triggers ingestion

Validate (check logs):
```
[image-processor] Polling for uploaded photos...
[image-processor] No pending photos found.
```

---

### Step 6 — Backend API

```bash
cd apps/backend
pnpm dev:server
# or from root to run backend + cleanup worker together:
cd apps/backend && pnpm dev
```

- Runs on port **8000**
- Debug port: **9230**

Validate:
```bash
curl http://localhost:8000/
# Expected: {"message":"Welcome to Fotno API"}
```

---

### Step 7 — Frontend Apps

Run all frontends at once from the root:
```bash
pnpm dev
```

Or run individually:
```bash
# Landing page   → http://localhost:3000
cd apps/landing && pnpm dev

# Dashboard      → http://localhost:3001
cd apps/dashboard && pnpm dev

# Auth           → http://localhost:3002
cd apps/auth && pnpm dev

# Gallery        → http://localhost:3003
cd apps/gallery && pnpm dev
```

---

## 3. All-at-Once (after first-time setup)

Open **5 terminals** and run:

| Terminal | Command |
|---|---|
| 1 | `redis-server` |
| 2 | `cd apps/siglip-service && python main.py` |
| 3 | `pnpm dev` (starts all Node services + frontends via Nx) |
| 4 | `cd apps/image-search-service && pnpm dev` |
| 5 | `cd apps/upload-service && pnpm dev` |

> Note: `pnpm dev` at root starts backend, image-processor, and all Next.js apps.
> Image-search-service and upload-service need to be started separately.

---

## 4. Port Map

| Service | Port |
|---|---|
| Landing | 3000 |
| Dashboard | 3001 |
| Auth | 3002 |
| Gallery | 3003 |
| Upload Service | 3010 |
| Image Search Service | 4002 |
| Backend API | 8000 |
| SigLIP Service (Python) | 8001 |
| Main Postgres DB | 5433 |
| PgVector Postgres DB | 5466 |
| Redis | 6379 |

---

## 5. Validation — End-to-End Flow

### 5.1 Auth Flow

1. Open http://localhost:3002
2. Register a new account (email + password)
3. Verify email (check Resend delivery or dev logs)
4. Log in → should redirect to dashboard at http://localhost:3001

```bash
# Smoke test — session cookie from backend
curl -c cookies.txt -X POST http://localhost:8000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Expected: {"user":{...},"session":{...}}
```

---

### 5.2 Gallery Creation

```bash
# Replace <token> with the session token from 5.1
curl -b cookies.txt -X POST http://localhost:8000/api/dashboard/galleries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Gallery","description":"My first gallery"}'
# Expected: {"id":"...","name":"Test Gallery",...}
```

---

### 5.3 Photo Upload Flow

```bash
GALLERY_ID=<id-from-step-5.2>

# Step 1 — Initialize batch upload
curl -b cookies.txt -X POST http://localhost:3010/api/upload/batch-init \
  -H "Content-Type: application/json" \
  -d "{\"galleryId\":\"$GALLERY_ID\",\"files\":[{\"filename\":\"test.jpg\",\"size\":500000,\"mimeType\":\"image/jpeg\"}]}"
# Expected: {"sessionId":"...","uploads":[{"photoId":"...","presignedUrl":"..."}]}

# Step 2 — Upload file to presigned S3 URL (from step above)
curl -X PUT "<presigned-url>" \
  -H "Content-Type: image/jpeg" \
  --data-binary @/path/to/test.jpg
# Expected: HTTP 200

# Step 3 — Confirm upload
curl -b cookies.txt -X POST http://localhost:3010/api/upload/confirm \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"<sessionId>","photoId":"<photoId>"}'
# Expected: {"status":"confirmed"}
```

---

### 5.4 Image Processing Validation

After confirming an upload, the image processor picks it up within 3 seconds.

Watch the image-processor logs:
```
[image-processor] Processing photo <photoId>...
[image-processor] Uploaded thumbnail → thumbnails/<photoId>.webp
[image-processor] Uploaded preview   → previews/<photoId>.webp
[image-processor] Ingesting photo into image-search-service...
[image-processor] Done — photo <photoId> processed in 2.3s
```

Then verify the embedding was ingested:
```bash
curl -X POST http://localhost:4002/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d "{\"galleryId\":\"$GALLERY_ID\",\"userId\":\"<userId>\",\"prompt\":\"test\",\"limit\":10}"
# Expected: {"photoIds":["<photoId>"],"scores":[0.87]}
```

---

### 5.5 SigLIP Embedding Validation

```bash
# Test text embedding
curl -X POST http://localhost:8001/embed-text \
  -H "Content-Type: application/json" \
  -d '{"text":"a sunny beach with people"}'
# Expected: {"embedding":[0.023,-0.041,...]} — array of 1152 floats

# Test image embedding
curl -X POST http://localhost:8001/embed-image \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png"}'
# Expected: {"embedding":[...]} — array of 1152 floats
```

---

### 5.6 Album Suggestion (AI)

```bash
curl -b cookies.txt -X POST http://localhost:8000/api/dashboard/galleries/$GALLERY_ID/ai/suggest-album \
  -H "Content-Type: application/json" \
  -d '{"prompt":"best outdoor shots from summer","albumSize":20}'
# Expected: {"photoIds":[...],"albumTitle":"Summer Outdoors","albumDescription":"..."}
```

---

### 5.7 Public Gallery Flow

```bash
# Get share token from gallery details
curl -b cookies.txt http://localhost:8000/api/dashboard/galleries/$GALLERY_ID
# Copy shareToken from response

# Access public gallery (no auth needed)
curl http://localhost:8000/api/public/gallery/<shareToken>
# Expected: gallery + photos array
```

---

## 6. Database Inspection

```bash
# Open Prisma Studio (main DB)
pnpm db:studio
# Opens at http://localhost:5555
# Browse: Photo, Gallery, User, ImageSearchImage, etc.
```

---

## 7. Kill All Services

```bash
pnpm kill
# Kills ports 3000, 3001, 3002, 3003, 8000

# Kill remaining services manually if needed
lsof -ti:4002 | xargs kill  # image-search-service
lsof -ti:3010 | xargs kill  # upload-service
lsof -ti:8001 | xargs kill  # siglip-service
```

---

## 8. Troubleshooting

### Redis not running
```bash
redis-server
# or on macOS with brew services:
brew services start redis
```

### SigLIP model download stuck
- The model is ~1.7 GB. Check disk space and network.
- Model is cached at `~/.cache/huggingface/` after first download.

### pgvector extension missing
```sql
-- Run on the pgvector DB (port 5466) as superuser
CREATE EXTENSION IF NOT EXISTS vector;
```

### Port already in use
```bash
pnpm kill
# then restart the service
```

### Image processor not picking up photos
- Check `NODE_ENV` is set
- Check `DIRECT_URL` is pointing to main DB (port 5433)
- Check `IMAGE_SEARCH_SERVICE_URL=http://localhost:4002` in `.env`
- Verify image-search-service is running before image-processor

### `DATABASE_URL` vs `DIRECT_URL` confusion
| Variable | DB | Port | Used by |
|---|---|---|---|
| `DIRECT_URL` | Main Postgres | 5433 | Prisma (packages/db), backend, image-processor |
| `DATABASE_URL` | PgVector Postgres | 5466 | image-search-service |
