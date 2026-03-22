# Fotno Monorepo Overview

**Fotno** is a full-stack photography platform built with **pnpm workspaces** and **Nx** for build orchestration.

## Tech Stack

- **Package Manager:** pnpm 9.12.3
- **Build System:** Nx 21.5.3
- **Runtime:** Node.js ≥20
- **Language:** TypeScript 5.5.4

### Frontend

- Next.js 15.1.9 with Turbopack
- React 19.0.2
- Tailwind CSS 4.0.8
- Radix UI components
- Form management: react-hook-form + Zod validation

### Backend

- Express.js servers (multiple services)
- Better Auth for authentication
- Prisma ORM with PostgreSQL
- BullMQ for job queue management
- Redis for state/caching

### Storage & External Services

- AWS S3 / Cloudflare R2 for object storage
- OpenAI API for image captioning/tagging
- Resend for email delivery
- Paymob for payments

---

## Directory Structure

```
fotno/monorepo/
├── apps/                      # Production applications
│   ├── landing/              # Marketing website (Next.js, port 3000)
│   ├── auth/                 # Authentication app (Next.js, port 3002)
│   ├── dashboard/            # User dashboard (Next.js, port 3001)
│   ├── gallery/              # Public gallery viewer (Next.js, port 3003)
│   ├── backend/              # Core API server (Express, port 8000)
│   ├── image-processor/      # Dedicated image processing service
│   └── upload-service/       # Specialized photo upload handler
│
├── packages/                 # Shared libraries & configs
│   ├── ui/                   # Shared UI component library
│   ├── lib/                  # Shared utilities (S3, email, auth, actions)
│   ├── db/                   # Prisma schema & database client
│   ├── eslint-config/        # ESLint configurations
│   └── typescript-config/    # TypeScript base configs
│
├── docs/                     # Architecture documentation
├── nx.json                   # Nx configuration
├── pnpm-workspace.yaml       # Workspace definition
├── tsconfig.json             # Root TypeScript config
└── .env                      # Environment variables
```

---

## Applications

### 1. Landing (Marketing Website)

- **Port:** 3000
- **Purpose:** Public-facing homepage and marketing
- **Features:** Headless UI components, motion animations, product showcase, SEO optimization

### 2. Auth (Authentication Service)

- **Port:** 3002
- **Purpose:** User authentication and account management
- **Features:** Better Auth integration, user registration/login, password recovery

### 3. Dashboard (User Control Panel)

- **Port:** 3001
- **Purpose:** Main user interface for managing galleries, photos, and clients
- **Features:** Gallery CRUD, photo upload & management, client management, QR code generation

### 4. Gallery (Public Viewer)

- **Port:** 3003
- **Purpose:** Public gallery viewing with optional password protection
- **Features:** Password-protected galleries, archive generation, real-time comments (SSE)

### 5. Backend API (Core Server)

- **Port:** 8000
- **Purpose:** RESTful API handling auth, CRUD, business logic, and orchestration
- **Key Services:** Authentication (JWT + Better Auth), photo metadata, gallery management, client management, storage quota tracking, payment processing, email notifications

### 6. Image Processor

- **Purpose:** Dedicated image transformation and metadata extraction
- **Features:** Thumbnail generation (WebP, ≤250KB), preview generation (WebP, ≤1MB), RAW format support (CR2, CR3, ARW, NEF, DNG, etc.)

### 7. Upload Service

- **Purpose:** High-performance multipart upload handling with deduplication
- **Features:** S3 multipart upload, presigned URL generation, upload session management, Redis-backed session state

**Upload Configuration:**

```
PROCESSOR_CONCURRENCY: 8
MAX_FILES_PER_BATCH: 500
MAX_FILE_SIZE_BYTES: 524288000 (500 MB)
CHUNK_SIZE_BYTES: 10485760 (10 MB)
UPLOAD_SESSION_TTL_HRS: 24
PRESIGNED_URL_TTL_SEC: 7200 (2 hours)
```

---

## Shared Packages

### @workspace/ui

Comprehensive UI component library with Radix UI primitives, Tailwind CSS integration, form components, custom hooks, theming support.

### @workspace/lib

Utility library: S3 utilities, email utilities (Resend), auth helpers (Better Auth), server actions, constants, data utilities.

### @workspace/db

Database abstraction: Prisma Client, schema at `packages/db/prisma/schema.prisma`

### @workspace/eslint-config & @workspace/typescript-config

Shared linting and TypeScript standards across workspace.

---

## Database Schema

| Model              | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| **User**           | User accounts with storage tracking and subscription plans |
| **Session**        | Authentication sessions with IP/user-agent tracking        |
| **Gallery**        | Photo collections with sharing & password protection       |
| **Photo**          | Individual photos with S3 keys, dimensions, AI metadata    |
| **Album**          | Groupings within galleries                                 |
| **Client**         | External collaborators invited to galleries                |
| **GalleryComment** | Real-time comment threads with reply support               |
| **Payment**        | Subscription and payment records                           |
| **StorageEvent**   | Audit log of storage usage changes                         |
| **UploadSession**  | Multipart upload state management                          |

**Plans:** FREE, STARTER, PROFESSIONAL, STUDIO, ENTERPRISE

---

## Key Data Flows

### Photo Upload Pipeline

1. **Initialize** - Client requests presigned URLs for multipart upload
2. **Upload Chunks** - Client uploads 10MB chunks directly to S3
3. **Confirm** - Client confirms upload completion, triggers processing
4. **Process** - Background worker generates thumbnail + preview variants
5. **Complete** - Photo marked as processed, ready for display

**S3 Keys:**

- Originals: `originals/{galleryId}/{photoId}/{filename}`
- Thumbnails: `thumbnails/{galleryId}/{photoId}.webp`
- Previews: `previews/{galleryId}/{photoId}.webp`

### Real-Time Comments (SSE)

Browser → Gallery Next.js → Express Backend → Database → Broadcast to all SSE listeners

---

## NPM Scripts

### Root Level

```bash
pnpm build              # Build all packages/apps (Nx)
pnpm dev                # Run all dev servers in parallel
pnpm dev:image-processor # Run image processor specifically
pnpm lint               # Lint all packages
pnpm format             # Format code with Prettier
pnpm kill               # Kill processes on ports 3000-3003, 8000
```

### Database

```bash
pnpm --filter backend exec prisma generate
pnpm --filter backend exec prisma migrate dev --name <name>
pnpm --filter backend exec prisma db push
pnpm --filter backend exec prisma migrate reset
pnpm --filter backend exec prisma studio
```

---

## Environment Variables

**Public URLs (in `nx.json`):**

```
NEXT_PUBLIC_API_URL           # Backend API
NEXT_PUBLIC_AUTH_URL          # Auth service
NEXT_PUBLIC_DASHBOARD_URL     # Dashboard
NEXT_PUBLIC_GALLERY_URL       # Gallery viewer
NEXT_PUBLIC_LANDING_URL       # Website
NEXT_PUBLIC_LANDING_URL       # Landing page
```

**Required Services:**

- PostgreSQL with Prisma adapter
- Redis for BullMQ & sessions
- AWS S3 / Cloudflare R2 for object storage
- Better Auth for authentication
- Resend for email delivery
- OpenAI for image analysis

---

## Scaling Architecture

- **Upload Service** is separate from Backend API for independent scaling
- **Image Processor** handles CPU-intensive work asynchronously
- **BullMQ** distributes jobs across worker instances
- **Redis** provides fast session/queue state

**Horizontal Scaling:**

- Run multiple Upload Service instances (all share Redis + DB)
- Adjust `PROCESSOR_CONCURRENCY` per instance (8-16 recommended)
- Effective throughput = `PROCESSOR_CONCURRENCY` × number of instances

**Background Workers:**

- `cleanupPhotoWorker` - Removes stale uploads (hourly)
- `reconcileStorageWorker` - Fixes storage accounting drift (daily, 03:00)
- `process-photo` - Generates thumbnail/preview variants (on-demand)

---

## Recent Features

- Image search with SigLIP embeddings
- AI-powered album suggestions
- Public gallery access with password protection
- New upload service architecture
- Centralized logout & auth enforcement
- Original photo downloads
- Enhanced client management
