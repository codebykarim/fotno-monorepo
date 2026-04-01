# Implementation Plan: Smart Album Workflow

**Branch**: `003-smart-album-workflow` | **Date**: 2026-03-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-smart-album-workflow/spec.md`

## Summary

Add a SmartAlbums-style album design workflow to Fotno, allowing clients to design physical photo albums from gallery images, submit for photographer review, and optionally pay through the platform. Photographers configure album products (sizes, covers, paper, pricing), review client submissions, and export print-ready spread images. The feature spans the gallery app (client designer), dashboard app (photographer settings/review), and backend (API + export rendering).

## Technical Context

**Language/Version**: TypeScript 5.5+ on Node.js ≥20
**Primary Dependencies**: Next.js 16, React 19, Express 4, Prisma 7.5, Stripe SDK (+ Stripe Connect), Sharp, Zustand, SWR
**Storage**: PostgreSQL (new models), S3/CloudFront (image access + export storage)
**Testing**: Manual (no automated test infrastructure exists)
**Target Platform**: Web (desktop browsers; mobile album design out of scope for v1)
**Project Type**: Multi-service monorepo (web services + frontends)
**Performance Goals**: Album designer responsive with 500-image galleries; export generation under 2 minutes for a 20-spread album
**Constraints**: Existing Album model must not be modified; new entities use SmartAlbum prefix
**Scale/Scope**: Photographer-level feature; expected initial usage <100 concurrent designers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| --- | --- | --- |
| I. Monorepo Cohesion | PASS | All code in existing apps/ and packages/. No new apps needed. Shared via @workspace/* |
| II. Strict TypeScript | PASS | All new code in TypeScript strict mode. Prisma types from @workspace/db |
| III. Server-First Rendering | PASS | Album settings pages use server components. Designer uses "use client" (requires canvas/interaction) |
| IV. Shared UI Consistency | PASS | All new UI components use @workspace/ui, CVA variants, Tailwind, cn() |
| V. Domain-Scoped Backend Services | PASS | New SmartAlbumServices/ domain. Routes delegate to services. Services return {data, status} |
| VI. Containerized Deployment | PASS | No new services. Existing Dockerfiles unchanged. Migration runs on startup |
| VII. Subscription-Gated Access | PASS | Product creation gated by isActiveSubscriber. Album design accessible to clients (no subscription needed) |

**Post-Phase 1 Re-check**: All principles remain satisfied. The album designer's "use client" directive is justified by canvas rendering, drag-and-drop, and real-time image manipulation requirements.

## Project Structure

### Documentation (this feature)

```text
specs/003-smart-album-workflow/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Research decisions
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Developer quickstart
├── contracts/
│   └── api-endpoints.md # Phase 1: API contracts
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
apps/
├── backend/src/
│   ├── routes/
│   │   ├── index.ts                    # Mount new smartAlbumRoutes
│   │   └── smartAlbumRoutes.ts         # NEW: Smart album route definitions
│   └── services/
│       ├── SmartAlbumServices/         # NEW: Photographer config, products, submissions, export
│       └── PublicGalleryServices/      # EXTEND: Client album design endpoints
├── gallery/
│   ├── app/[shareToken]/album/         # NEW: Album designer pages
│   ├── components/album/              # NEW: Designer components
│   └── lib/                           # NEW: album-service, album-store, album-types, layout-templates
├── dashboard/
│   ├── app/smart-albums/              # NEW: Settings + submissions pages
│   └── components/smart-albums/       # NEW: Config, product, review components
└── packages/
    └── db/prisma/schema.prisma        # EXTEND: SmartAlbum* models + enums
```

**Structure Decision**: No new apps or packages. Feature is distributed across existing `backend`, `gallery`, and `dashboard` apps, with schema additions in `@workspace/db`. This follows Principle I (Monorepo Cohesion) and avoids unnecessary service proliferation.

## Complexity Tracking

No constitution violations to justify. All work fits within existing apps and follows established patterns.
