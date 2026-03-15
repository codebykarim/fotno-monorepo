# Fotno — Coolify Deployment Guide (Docker Compose)

## Overview

All 11 services are deployed as a single Docker Compose stack in Coolify.
Internal services communicate by service name (e.g. `http://siglip-service:8001`).
Databases (PostgreSQL, pgvector, Redis) are provisioned separately in Coolify.

## Step 1: Delete Existing Individual Apps

In Coolify, delete all the individual Application resources you created earlier.
Keep your 3 database resources (fotno-database, fotno-pgvector, fotno-redis).

## Step 2: Create Docker Compose Service

1. In Coolify, click **+ New** > **Docker Compose**
2. Select your Git repository (`codebykarim/fotno-monorepo`)
3. Branch: `main`
4. Coolify will detect `docker-compose.yml` at the repo root

## Step 3: Set Environment Variables

In the Coolify **Environment Variables** section for the compose service,
add all your variables. These are injected into every service via `env_file: .env`.

### Required Variables

```env
# ── Main Database (your fotno-database in Coolify) ──
DATABASE_URL=postgresql://user:pass@fotno-database:5432/fotno
DIRECT_URL=postgresql://user:pass@fotno-database:5432/fotno

# ── pgvector Database (your fotno-pgvector in Coolify) ──
IMAGE_SEARCH_DATABASE_URL=postgresql://user:pass@fotno-pgvector:5432/fotno_search

# ── Redis (your fotno-redis in Coolify) ──
REDIS_URL=redis://fotno-redis:6379

# ── Auth ──
JWT_SECRET=<generate-a-strong-secret>
BETTER_AUTH_SECRET=<generate-a-strong-secret>
BETTER_AUTH_URL=https://api.fotno.com

# ── S3 / Cloudflare R2 ──
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=auto
AWS_S3_ENDPOINT=<your-r2-endpoint>
AWS_S3_BUCKET=<your-bucket>

# ── Email ──
RESEND_API_KEY=<your-key>

# ── AI / OpenAI (optional, for search tagging) ──
OPENAI_API_KEY=<your-key>

# ── Frontend URLs (NEXT_PUBLIC_* are baked at build time) ──
NEXT_PUBLIC_API_URL=https://api.fotno.com
NEXT_PUBLIC_AUTH_URL=https://auth.fotno.com
NEXT_PUBLIC_DASHBOARD_URL=https://app.fotno.com
NEXT_PUBLIC_GALLERY_URL=https://gallery.fotno.com
NEXT_PUBLIC_LANDING_URL=https://fotno.com

# ── Internal backend URL (used by Next.js SSR to reach backend over Docker network) ──
BACKEND_API_URL=http://backend:8000

# ── Internal service URLs ──
IMAGE_SEARCH_SERVICE_URL=http://image-search-service:4002
UPLOAD_SERVICE_URL=http://upload-service:4001
SIGLIP_SERVICE_URL=http://siglip-service:8001
QWEN_SERVICE_URL=http://qwen-ai-service:8002

# ── Gallery session (server-side secret for password-protected galleries) ──
GALLERY_SESSION_SECRET=<generate-a-strong-secret>

# ── OAuth (optional) ──
GOOGLE_CLIENT_ID=<if-using-google-auth>
GOOGLE_CLIENT_SECRET=<if-using-google-auth>
GITHUB_CLIENT_ID=<if-using-github-auth>
GITHUB_CLIENT_SECRET=<if-using-github-auth>

# ── Payments (optional) ──
PAYMOB_API_KEY=<if-using-paymob>
PAYMOB_SECRET_KEY=<if-using-paymob>
PAYMOB_PUBLIC_KEY=<if-using-paymob>
```

> **Important:** Use the Coolify internal hostnames for your databases
> (e.g. `fotno-database`, `fotno-pgvector`, `fotno-redis`).
> Check each database resource in Coolify for its internal hostname.

## Step 4: Configure Domains

In Coolify, for each service that needs a public domain, set the domain in the compose service settings:

| Service | Domain | Port |
|---------|--------|------|
| `backend` | `api.fotno.com` | 8000 |
| `upload-service` | `upload.fotno.com` | 4001 |
| `landing` | `fotno.com` | 3000 |
| `dashboard` | `app.fotno.com` | 3001 |
| `auth` | `auth.fotno.com` | 3002 |
| `gallery` | `gallery.fotno.com` | 3003 |
| `admin` | `admin.fotno.com` | 3004 |

**Do NOT assign domains** to internal-only services:
- `image-search-service` (port 4002)
- `image-processor` (no HTTP port)
- `siglip-service` (port 8001)
- `qwen-ai-service` (port 8002)

## Step 5: Deploy

Click **Deploy**. Coolify will build all 11 services and start them.

First deployment will be slow (~10-15 min) because:
- pnpm installs all dependencies
- AI models download on first start (~1.7GB SigLIP, ~4GB Qwen)

Subsequent deployments are faster thanks to Docker layer caching.

## Database Migrations

### Main database (Prisma)

Runs automatically on every startup of the `backend` container.
The backend CMD runs `prisma migrate deploy` before starting the API server,
so new migrations are applied on each deployment with zero manual intervention.

If you need to run migrations manually (e.g. troubleshooting), exec into the backend container:

```bash
cd /app/packages/db && npx prisma migrate deploy
```

### pgvector database

Runs automatically on every startup of `image-search-service` (idempotent).

## Networking

Docker Compose creates a shared network. Internal service URLs are hardcoded
in `docker-compose.yml` via `environment:` overrides:

```
backend        → http://image-search-service:4002
image-processor → http://image-search-service:4002
image-search   → http://siglip-service:8001
image-search   → http://qwen-ai-service:8002
```

Databases are reached via their Coolify internal hostnames set in the env vars.

## Resource Requirements

| Service | RAM | Notes |
|---------|-----|-------|
| backend | 512MB | API + cleanup worker |
| upload-service | 512MB | Chunked uploads + Sharp |
| image-processor | 512MB | Sharp image processing |
| image-search-service | 256MB | Search orchestration |
| siglip-service | 2.5GB | SigLIP model in memory |
| qwen-ai-service | 5GB | Qwen 2b model in memory |
| landing | 128MB | Static Next.js |
| dashboard | 256MB | SSR Next.js |
| auth | 128MB | Auth pages |
| gallery | 256MB | SSR galleries |
| admin | 128MB | Admin panel |

**Total:** ~10GB RAM, 4 CPU cores

## Troubleshooting

### "frozen lockfile" build error
Run `pnpm install` locally and commit `pnpm-lock.yaml`.

### AI services OOM
Increase RAM in Coolify resource limits. SigLIP needs ~2.5GB, Qwen 2b needs ~5GB.

### Image processor not picking up photos
Check that `IMAGE_SEARCH_SERVICE_URL` resolves (test from container terminal).

### Database connection refused
Ensure databases and compose services are on the same Docker network.
Check Coolify internal hostnames match your env vars.

### Next.js shows wrong API URL
`NEXT_PUBLIC_API_URL` is baked in at build time. You must redeploy after changing it.
