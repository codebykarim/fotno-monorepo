# Fotno — Coolify Deployment Guide

## Prerequisites

Before deploying, ensure you have these provisioned in Coolify:

- **PostgreSQL (main)** — for Prisma/app data
- **PostgreSQL (pgvector)** — with `vector` extension enabled, for image search
- **Redis** — for BullMQ job queues and caching
- **S3/R2 storage** — already configured externally

## Domain Plan

| Service | Domain | Port |
|---------|--------|------|
| landing | `fotno.com` | 3000 |
| dashboard | `app.fotno.com` | 3001 |
| auth | `auth.fotno.com` | 3002 |
| gallery | `gallery.fotno.com` | 3003 |
| admin | `admin.fotno.com` | 3004 |
| backend | `api.fotno.com` | 8000 |
| upload-service | `upload.fotno.com` | 3010 |
| image-search-service | Internal only | 4002 |
| image-processor | Internal only (no HTTP) | — |
| siglip-service | Internal only | 8001 |
| qwen-ai-service | Internal only | 8002 |

> Internal services don't need public domains. Use Coolify's internal networking
> (service names as hostnames, e.g. `http://siglip-service:8001`).

## Deploy Order

Deploy infrastructure first, then services in dependency order:

```
1. Redis, PostgreSQL (main), PostgreSQL (pgvector)   — already provisioned
2. siglip-service                                     — no dependencies
3. qwen-ai-service                                    — no dependencies
4. image-search-service                               — needs Redis, pgvector DB, siglip, qwen
5. backend                                            — needs Redis, main DB
6. upload-service                                     — needs Redis, main DB, S3
7. image-processor                                    — needs main DB, S3, image-search-service
8. landing, auth, dashboard, gallery, admin            — need backend API URL
```

## Creating Each Service in Coolify

For each service, create a new **Application** in Coolify with these settings:

### Common Settings (all services)

- **Repository:** Your Git repo URL
- **Branch:** `main`
- **Build context:** `/` (repo root)
- **Build pack:** Dockerfile

### Per-Service Configuration

#### backend

- **Dockerfile:** `apps/backend/Dockerfile`
- **Port:** `8000`
- **Domain:** `api.fotno.com`
- **Health check path:** `/api/health` (or your health endpoint)
- **Environment variables:**
  ```
  DATABASE_URL=postgresql://user:pass@<main-pg-host>:5432/fotno
  DIRECT_URL=postgresql://user:pass@<main-pg-host>:5432/fotno
  REDIS_URL=redis://<redis-host>:6379
  JWT_SECRET=<your-secret>
  BETTER_AUTH_SECRET=<your-secret>
  BETTER_AUTH_URL=https://api.fotno.com
  AWS_ACCESS_KEY_ID=<your-key>
  AWS_SECRET_ACCESS_KEY=<your-secret>
  AWS_REGION=auto
  AWS_ENDPOINT=<your-r2-endpoint>
  S3_BUCKET=<your-bucket>
  RESEND_API_KEY=<your-key>
  IMAGE_SEARCH_SERVICE_URL=http://image-search-service:4002
  UPLOAD_SERVICE_URL=http://upload-service:3010
  ```

#### upload-service

- **Dockerfile:** `apps/upload-service/Dockerfile`
- **Port:** `3010`
- **Domain:** `upload.fotno.com`
- **Environment variables:**
  ```
  DATABASE_URL=postgresql://user:pass@<main-pg-host>:5432/fotno
  DIRECT_URL=postgresql://user:pass@<main-pg-host>:5432/fotno
  REDIS_URL=redis://<redis-host>:6379
  JWT_SECRET=<your-secret>
  AWS_ACCESS_KEY_ID=<your-key>
  AWS_SECRET_ACCESS_KEY=<your-secret>
  AWS_REGION=auto
  AWS_ENDPOINT=<your-r2-endpoint>
  S3_BUCKET=<your-bucket>
  ```

#### image-processor

- **Dockerfile:** `apps/image-processor/Dockerfile`
- **Port:** None (background worker — disable health checks)
- **Domain:** None
- **Environment variables:**
  ```
  DATABASE_URL=postgresql://user:pass@<main-pg-host>:5432/fotno
  DIRECT_URL=postgresql://user:pass@<main-pg-host>:5432/fotno
  AWS_ACCESS_KEY_ID=<your-key>
  AWS_SECRET_ACCESS_KEY=<your-secret>
  AWS_REGION=auto
  AWS_ENDPOINT=<your-r2-endpoint>
  S3_BUCKET=<your-bucket>
  IMAGE_SEARCH_SERVICE_URL=http://image-search-service:4002
  ```

#### image-search-service

- **Dockerfile:** `apps/image-search-service/Dockerfile`
- **Port:** `4002`
- **Domain:** None (internal only)
- **Environment variables:**
  ```
  DATABASE_URL=postgresql://user:pass@<pgvector-host>:5432/fotno_search
  REDIS_URL=redis://<redis-host>:6379
  JWT_SECRET=<your-secret>
  SIGLIP_SERVICE_URL=http://siglip-service:8001
  QWEN_SERVICE_URL=http://qwen-ai-service:8002
  OPENAI_API_KEY=<your-key>
  EMBEDDING_BATCH_SIZE=16
  EMBEDDING_WORKER_CONCURRENCY=2
  ```

#### siglip-service

- **Dockerfile:** `apps/siglip-service/Dockerfile`
- **Port:** `8001`
- **Domain:** None (internal only)
- **Volumes:** Mount a persistent volume at `/root/.cache/huggingface` to cache the model (~1.7GB download on first start)
- **Environment variables:**
  ```
  PORT=8001
  MAX_BATCH_SIZE=16
  ```

#### qwen-ai-service

- **Dockerfile:** `apps/qwen-ai-service/Dockerfile`
- **Port:** `8002`
- **Domain:** None (internal only)
- **Volumes:** Mount a persistent volume at `/root/.cache/huggingface` to cache the model (~4GB download on first start)
- **Environment variables:**
  ```
  QWEN_SERVICE_PORT=8002
  MODEL_SIZE=2b
  MAX_BATCH_SIZE=8
  ```

#### landing

- **Dockerfile:** `apps/landing/Dockerfile`
- **Port:** `3000`
- **Domain:** `fotno.com`
- **Environment variables (build-time):**
  ```
  NEXT_PUBLIC_API_URL=https://api.fotno.com
  ```

#### dashboard

- **Dockerfile:** `apps/dashboard/Dockerfile`
- **Port:** `3001`
- **Domain:** `app.fotno.com`
- **Environment variables (build-time):**
  ```
  NEXT_PUBLIC_API_URL=https://api.fotno.com
  ```

#### auth

- **Dockerfile:** `apps/auth/Dockerfile`
- **Port:** `3002`
- **Domain:** `auth.fotno.com`
- **Environment variables (build-time):**
  ```
  NEXT_PUBLIC_API_URL=https://api.fotno.com
  ```

#### gallery

- **Dockerfile:** `apps/gallery/Dockerfile`
- **Port:** `3003`
- **Domain:** `gallery.fotno.com`
- **Environment variables (build-time):**
  ```
  NEXT_PUBLIC_API_URL=https://api.fotno.com
  ```

#### admin

- **Dockerfile:** `apps/admin/Dockerfile`
- **Port:** `3004`
- **Domain:** `admin.fotno.com`
- **Environment variables (build-time):**
  ```
  NEXT_PUBLIC_API_URL=https://api.fotno.com
  ```

## Database Migrations

### Main database (Prisma)

Run once after first deploy (or on schema changes) from the backend container:

```bash
npx prisma migrate deploy --schema=../../packages/db/prisma/schema.prisma
```

Or via Coolify's terminal for the backend service:
```bash
cd /app && pnpm --filter @workspace/db db:deploy
```

### pgvector database (image search)

The image-search-service automatically runs its schema migration on every startup
(`scripts/db-deploy.cjs`). All statements are idempotent (`CREATE IF NOT EXISTS`).

## AI Services Notes (4-thread Xeon, CPU-only)

- **SigLIP:** Embedding generation works well on CPU. Expect ~0.5-1s per image.
- **Qwen 2b:** Captioning on CPU will be slow (~30-60s per image). This is acceptable
  for background processing. The 2b model uses ~4GB RAM.
- Both services set `OMP_NUM_THREADS=4` and `MKL_NUM_THREADS=4` to match your CPU.
- Mount persistent volumes for `/root/.cache/huggingface` to avoid re-downloading
  models on container restarts.

## Resource Recommendations

| Service | RAM | CPU | Notes |
|---------|-----|-----|-------|
| backend | 512MB | 0.5 | Main API |
| upload-service | 512MB | 0.5 | Handles chunked uploads |
| image-processor | 512MB | 0.5 | Sharp image processing |
| image-search-service | 256MB | 0.25 | Search orchestration |
| siglip-service | 2.5GB | 1 | Model loaded in memory |
| qwen-ai-service | 5GB | 2 | 2b model loaded in memory |
| landing | 128MB | 0.1 | Static-ish Next.js |
| dashboard | 256MB | 0.25 | SSR Next.js |
| auth | 128MB | 0.1 | Auth pages |
| gallery | 256MB | 0.25 | SSR galleries |
| admin | 128MB | 0.1 | Admin panel |

**Total:** ~10GB RAM, 4 CPU cores

## Networking

Coolify uses Docker networking. Internal services communicate via container names:

- `http://backend:8000` — from frontends (server-side)
- `http://siglip-service:8001` — from image-search-service
- `http://qwen-ai-service:8002` — from image-search-service
- `http://image-search-service:4002` — from backend and image-processor
- `http://upload-service:3010` — from backend

> Make sure all services are on the same Docker network in Coolify.

## Troubleshooting

### Build fails with "frozen lockfile" error
Ensure `pnpm-lock.yaml` is committed and up to date. Run `pnpm install` locally and commit the lockfile.

### Prisma generate fails
The Prisma schema uses `binaryTargets = ["native"]` which auto-detects the Docker build platform. If issues arise, add `"debian-openssl-3.0.x"` to the binaryTargets array in `packages/db/prisma/schema.prisma`.

### AI services OOM (Out of Memory)
Increase the RAM allocation. SigLIP needs ~2.5GB, Qwen 2b needs ~5GB.

### Image processor not processing photos
Check that `IMAGE_SEARCH_SERVICE_URL` is reachable and that the main database connection is working. The processor polls every 3 seconds.
