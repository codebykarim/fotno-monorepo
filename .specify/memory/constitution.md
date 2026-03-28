<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 (template) → 1.0.0
  Modified principles: N/A (first ratification — all new)
  Added sections:
    - I. Monorepo Cohesion
    - II. Strict TypeScript
    - III. Server-First Rendering
    - IV. Shared UI Consistency
    - V. Domain-Scoped Backend Services
    - VI. Containerized Deployment
    - VII. Subscription-Gated Access
    - Architecture Overview
    - Technology Stack Summary
    - Folder Structure Philosophy
    - Coding Conventions
    - Component Design Rules
    - Backend/API Standards
    - Environment & Configuration Strategy
    - Dependency Strategy
    - Git Workflow Signals
    - Performance Practices
    - Security Practices
    - Testing Strategy
    - Missing Governance Areas
    - Governance
  Removed sections: N/A (first ratification)
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution Check
      section references constitution generically)
    - .specify/templates/spec-template.md ✅ compatible (no constitution
      references requiring update)
    - .specify/templates/tasks-template.md ✅ compatible (phase structure
      aligns with monorepo conventions)
  Follow-up TODOs: None
-->

# Fotno Constitution

## Core Principles

### I. Monorepo Cohesion

All application code, shared packages, configuration, and infrastructure
definitions MUST reside in a single pnpm + Nx monorepo. Services communicate
through shared workspace packages (`@workspace/*`) using the `workspace:*`
protocol — never through published npm packages or git submodules.

- Every new app MUST be created under `apps/`.
- Every shared library MUST be created under `packages/`.
- Cross-package imports MUST use workspace aliases (`@workspace/db`,
  `@workspace/lib`, `@workspace/ui`), never relative paths across package
  boundaries.
- Nx orchestrates build, lint, and type-check tasks with caching enabled.
  New apps MUST integrate into the Nx task graph.

### II. Strict TypeScript

All source code MUST be written in TypeScript with `strict: true` enabled.
No `any` casts unless explicitly justified in a code comment. Type safety is
enforced at the compiler level via shared `@workspace/typescript-config`
base configurations.

- Frontend apps extend `@workspace/typescript-config/nextjs.json`.
- Backend services extend `@workspace/typescript-config/base.json` with
  `NodeNext` module resolution.
- The `@workspace/ui` package extends
  `@workspace/typescript-config/react-library.json`.
- `noUncheckedIndexedAccess: true` is mandatory across all configs.
- Prisma-generated types MUST be re-exported from `@workspace/db` and
  used as the single source of truth for database entity types.

### III. Server-First Rendering

Next.js applications MUST default to React Server Components. The `"use
client"` directive MUST only be added when a component requires browser-only
APIs, event handlers, hooks, or client-side state.

- Page-level data fetching MUST happen in server components or server
  actions.
- Authentication checks at the layout level MUST use `getSession()` with
  `await headers()` on the server.
- `generateMetadata()` MUST be used for SEO-critical pages.
- API proxy routes (e.g., `/api/*` in dashboard and admin) MUST forward
  requests to the backend service, never duplicate business logic.

### IV. Shared UI Consistency

All frontend applications MUST consume presentational components from
`@workspace/ui`. Direct use of Radix UI primitives outside the UI package
is prohibited — wrap them in `@workspace/ui` first.

- Component variants MUST use Class Variance Authority (CVA).
- Styling MUST use Tailwind CSS v4 utility classes composed via the `cn()`
  helper (clsx + tailwind-merge). No CSS modules, styled-components, or
  runtime CSS-in-JS.
- Color tokens MUST use the OKLch-based CSS custom properties defined in
  `@workspace/ui/globals.css`. Hardcoded color values are prohibited.
- Dark mode MUST be supported via `next-themes` class strategy and CSS
  variable toggling.
- Toast notifications MUST use Sonner via `@workspace/ui`.
- Form components MUST use React Hook Form + Zod + the `@workspace/ui`
  Form wrapper. Inline validation logic is prohibited.

### V. Domain-Scoped Backend Services

Backend logic MUST be organized into domain-scoped service modules. Each
service module owns its business logic and Prisma queries. Routes delegate
to services; services never import from routes.

- Route files MUST live under `src/routes/` and be mounted on the Express
  app at clearly scoped prefixes (e.g., `/api/dashboard`, `/api/billing`).
- Middleware MUST be composed declaratively via the `init()` utility in
  the method-routing pattern: auth → permissions → validation → handler.
- Services MUST return `{ data, status }` or `{ error, status }` objects.
  Services MUST NOT call `res.json()` or `res.status()` directly.
- Request validation in the backend MUST use Joi schemas declared per
  method. The upload service MUST use Zod schemas.
- Prisma transactions (`$transaction()`) MUST be used for multi-step
  writes that must be atomic.

### VI. Containerized Deployment

Every deployable service MUST have a Dockerfile using multi-stage builds.
All services MUST be orchestrable via `docker-compose.yml` for local
development and Coolify for production.

- Next.js apps MUST use `output: "standalone"` with
  `outputFileTracingRoot` pointing to the monorepo root.
- Next.js production images MUST run as a non-root user (`nextjs`,
  uid 1001).
- Backend services MUST use `node:20-slim`; Next.js runners MUST use
  `node:20-alpine`.
- Prisma client MUST be generated during the Docker build stage (with a
  dummy `DATABASE_URL` if needed).
- Database migrations MUST run automatically on backend container startup
  via `prisma migrate deploy`.
- Each service MUST expose a single port and declare it in
  `docker-compose.yml`.

### VII. Subscription-Gated Access

Feature access control MUST be enforced at the API middleware layer, never
only in the UI. The `isActiveSubscriber` middleware MUST gate creation and
upload endpoints. Storage limits MUST be validated server-side before
accepting uploads.

- Free tier defaults MUST be loaded from the `PricingTier` database table,
  not hardcoded in application code.
- Stripe webhook handlers MUST verify signatures using
  `stripe.webhooks.constructEvent()` with raw body capture.
- Storage quota checks MUST use BigInt arithmetic to prevent overflow on
  large accounts.
- Warning emails at 80% and 95% thresholds MUST be sent via Resend and
  tracked with `warningEmailSent80`/`warningEmailSent95` flags.

## Architecture Overview

Fotno is a photo management SaaS platform built as a multi-service monorepo.

**Service topology:**

| Service           | Type              | Port | Purpose                          |
|-------------------|-------------------|------|----------------------------------|
| `landing`         | Next.js 16        | 3000 | Marketing site                   |
| `dashboard`       | Next.js 16        | 3001 | Photographer workspace           |
| `auth`            | Next.js 16        | 3002 | Authentication flows             |
| `gallery`         | Next.js 16        | 3003 | Public gallery viewer            |
| `admin`           | Next.js 16        | 3004 | Admin panel                      |
| `backend`         | Express 4         | 8000 | Core API + cleanup worker        |
| `upload-service`  | Express 5         | 4001 | Chunked S3 uploads               |
| `image-processor` | Node.js worker    | —    | Thumbnail/preview generation     |

**Shared packages:**

| Package                       | Purpose                                |
|-------------------------------|----------------------------------------|
| `@workspace/db`               | Prisma client, schema, migrations      |
| `@workspace/lib`              | Auth client, S3, email, constants      |
| `@workspace/ui`               | React component library (Radix + CVA)  |
| `@workspace/eslint-config`    | Shared ESLint configurations           |
| `@workspace/typescript-config`| Shared TypeScript base configs         |

**Layering:** Next.js apps → API proxy routes → Express backend → Prisma →
PostgreSQL. Background work flows through Bull/BullMQ queues backed by
Redis or via database polling (image-processor).

## Technology Stack Summary

| Layer           | Technology                                           |
|-----------------|------------------------------------------------------|
| Runtime         | Node.js ≥20, TypeScript 5.5+                         |
| Frontend        | Next.js 16, React 19, Tailwind CSS 4                 |
| UI primitives   | Radix UI, CVA, Lucide icons, Sonner toasts           |
| State           | Zustand (client UI state), SWR (server cache)        |
| Forms           | React Hook Form + Zod + @hookform/resolvers          |
| Backend         | Express 4 (backend), Express 5 (upload-service)      |
| ORM             | Prisma 7.5 with `@prisma/adapter-pg`                 |
| Database        | PostgreSQL                                           |
| Cache / Queues  | Redis, Bull (backend), BullMQ (upload-service)        |
| Storage         | AWS S3 (Intelligent-Tiering) + CloudFront signed URLs|
| Auth            | better-auth 1.5 (email/password, OAuth, OTP, multi-session) |
| Payments        | Stripe (subscriptions, webhooks, regional pricing)   |
| Email           | Resend                                               |
| Monitoring      | Sentry (error tracking, tracing, profiling)          |
| Analytics       | Rybbit (self-hosted)                                 |
| Build           | Nx 21.5, pnpm 9.12                                  |
| Deployment      | Docker multi-stage, Coolify (self-hosted PaaS)       |
| Formatting      | Prettier, ESLint (with Turbo plugin)                 |

## Folder Structure Philosophy

```
monorepo/
├── apps/
│   ├── landing/          # Public marketing site
│   ├── dashboard/        # Core photographer workspace
│   ├── auth/             # Authentication flows (login, signup, reset)
│   ├── gallery/          # Public gallery viewer + API routes
│   ├── admin/            # Internal admin panel
│   ├── backend/          # Express API server
│   │   └── src/
│   │       ├── routes/       # Domain-scoped route files
│   │       ├── services/     # Business logic by domain
│   │       ├── middleware/   # Auth, subscription, admin guards
│   │       ├── workers/      # Bull queue processors
│   │       └── utils/        # S3, Sentry, helpers
│   ├── upload-service/   # Chunked upload + import workers
│   └── image-processor/  # Polling worker for thumbnails
├── packages/
│   ├── db/               # Prisma schema, client, migrations, seed
│   ├── lib/              # Shared auth, S3, email, constants
│   ├── ui/               # Shared React component library
│   ├── eslint-config/    # ESLint presets (base, next-js, node)
│   └── typescript-config/# TSConfig presets (base, nextjs, react-library)
├── docs/                 # Project documentation
├── specs/                # Feature specifications (speckit)
├── docker-compose.yml    # Full stack orchestration
├── nx.json               # Nx task configuration
└── pnpm-workspace.yaml   # Workspace definition
```

**Responsibilities:**
- `apps/` owns runnable services. Each app has its own `package.json`,
  `Dockerfile`, and `tsconfig.json`.
- `packages/` owns shared code consumed by multiple apps. Packages MUST NOT
  import from `apps/`.
- `specs/` owns feature design artifacts (spec, plan, tasks, research).
- `docs/` owns operational documentation (cost analysis, deployment guides).

## Coding Conventions

**Naming:**
- Files: `camelCase.ts` for modules, `kebab-case.tsx` for components by
  convention (both patterns exist; prefer consistency within each app).
- Variables and functions: `camelCase`.
- Types and interfaces: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants, `camelCase` for
  derived values.
- Database models: `PascalCase` (Prisma convention).
- API routes: `kebab-case` URL segments.

**Async handling:**
- Express routes use `express-async-errors` to auto-catch unhandled
  promise rejections.
- Services use `async/await` exclusively — no raw `.then()` chains.
- Batch operations use `Promise.allSettled()` to tolerate partial failures.
- Long-running operations use `withTimeout()` wrappers.

**Error handling:**
- Custom `AppError` class with `message` and `statusCode` properties.
- Upload service extends this with `code` and `meta` fields.
- Global error middleware catches `AppError` (controlled), `ZodError`
  (validation), and generic `Error` (unexpected).
- Sentry captures 5xx errors with request context; 4xx errors are filtered.

**Formatting:**
- Prettier for all `.ts`, `.tsx`, `.md` files (run via `pnpm format`).
- ESLint with TypeScript, React, React Hooks, and Turbo plugins.
- Shared configs in `@workspace/eslint-config` (base, next-js, node).

## Component Design Rules

- All reusable UI components MUST live in `@workspace/ui` under
  `src/components/`.
- Components MUST be exported via the `exports` field in
  `packages/ui/package.json` using path-based exports
  (`./components/button`, `./hooks/use-mobile`, etc.).
- Components MUST accept `className` for Tailwind composition.
- Interactive components (dropdowns, dialogs, tooltips) MUST wrap Radix UI
  primitives with project-specific styling.
- Variant logic MUST use CVA (`class-variance-authority`).
- The `cn()` utility (`clsx` + `tailwind-merge`) MUST be used for
  conditional class composition.
- App-specific components that are not shared MUST remain in the app's own
  `components/` directory.
- Icons MUST use Lucide React. Custom SVG icons MUST be added to
  `@workspace/ui/src/components/icons.tsx`.
- Animations MUST use Framer Motion or Motion library. CSS keyframe
  animations are acceptable for simple transitions.
- Phone input MUST use `react-phone-number-input` via the UI package.
- OTP input MUST use `input-otp` via the UI package.

## Backend/API Standards

**Routing:**
- The backend uses a dynamic method-based routing system where routes map
  to controller functions via a `method` query/path parameter.
- The `init()` utility composes middleware chains per method:
  `[isAuth, isActiveSubscriber?, joiValidation?, handler]`.
- Route groups: `dashboardRoutes`, `billingRoutes`, `adminRoutes`,
  `publicGalleryRoutes`, `storageRoutes`, `userRoutes`.

**Response format:**
- Success: `{ data: T }` or domain-specific shape (e.g.,
  `{ galleries: [...] }`), HTTP 200/201.
- Error: `{ error: string }` with appropriate HTTP status code
  (400/401/403/404/409/413/415/502).
- Upload service errors: `{ error: string, message: string, meta?: {} }`.

**Middleware stack (order matters):**
1. CORS (credential-aware, explicit origin whitelist)
2. Body parser (JSON, 1MB limit; raw body capture for Stripe webhooks)
3. Better-auth session handler
4. Sentry request tagging
5. Route-specific middleware (auth, subscription, admin)
6. Joi/Zod validation
7. Controller execution
8. Sentry error handler
9. Custom error middleware

**Workers:**
- Photo cleanup: Bull queue with 3 retries, exponential backoff.
- Storage reconciliation: Cron-scheduled Bull job (daily at 03:00).
- Upload service: BullMQ workers for photo processing, cleanup, Google
  Drive/Photos import.
- Image processor: Database polling every 3 seconds, batch size 5, stale
  record reclaim after 120 seconds.

## Environment & Configuration Strategy

**Variable loading:**
- Backend services load `.env` from the monorepo root via `dotenv` in
  `bootstrap.ts` (resolves two levels up from service directory).
- Next.js apps use built-in `.env` support with `NEXT_PUBLIC_*` prefix for
  client-exposed values.
- Docker builds inject `NEXT_PUBLIC_*` variables as build args; runtime
  variables are injected via `docker-compose.yml` or Coolify UI.

**Naming conventions:**
- `NEXT_PUBLIC_*_URL`: Public-facing service URLs (API, auth, dashboard,
  gallery, landing).
- `AWS_*`: S3 and IAM credentials.
- `CLOUDFRONT_*`: CDN signing configuration.
- `STRIPE_*`: Payment processing keys and price IDs.
- `*_DSN`: Sentry data source names.
- `REDIS_URL`, `DATABASE_URL`, `DIRECT_URL`: Infrastructure connections.
- Service-specific: `IMAGE_PROCESSOR_*`, `UPLOAD_SERVICE_*`,
  `PHOTO_WORKER_IN_API`.

**Separation:**
- `.env` for local development, `.env.prod` for production values.
- Nx named inputs track `NEXT_PUBLIC_*` variables for build cache
  invalidation.
- No `.env.example` file currently exists (see Missing Governance Areas).

## Dependency Strategy

- **UI primitives:** Radix UI for accessible, unstyled components. Never
  install competing component libraries (Material UI, Chakra, Ant Design).
- **State:** Zustand for client-side UI state. SWR for server state caching
  and revalidation. No Redux, Jotai, or React Query.
- **Forms:** React Hook Form + Zod. No Formik or manual form state.
- **HTTP:** Native `fetch` via SWR fetchers. No Axios.
- **Image processing:** Sharp (Node.js). No ImageMagick or GraphicsMagick.
- **Queues:** Bull (backend), BullMQ (upload-service). Both backed by Redis.
- **Email:** Resend. No Nodemailer or SendGrid.
- **Payments:** Stripe. No alternative payment processors.
- **Auth:** better-auth. No NextAuth, Clerk, or Auth0.
- **Monitoring:** Sentry for error tracking, tracing, and profiling.
- **Analytics:** Rybbit (self-hosted, privacy-first).
- All dependencies MUST be added via `pnpm add` within the correct
  workspace package. Root-level dependencies are limited to tooling (Nx,
  Prettier, TypeScript).

## Git Workflow Signals

**Branching:**
- `main` is the production branch.
- Feature branches follow the pattern `###-feature-name` (e.g.,
  `001-fix-billing-remove-trial`).
- Claude-generated branches use `claude/descriptive-name`.

**Commits:**
- Conventional-style prefixes observed: `feat:`, `fix:`, `refactor:`.
- Commit messages describe the change purpose in imperative mood.
- Co-authored commits include `Co-Authored-By` trailer.

**No CI/CD pipeline detected.** Deployment is manual via Coolify with
Docker Compose. Database migrations auto-run on container startup.

## Performance Practices

**Frontend:**
- Next.js `output: "standalone"` for minimal production bundles.
- Image optimization via Next.js `<Image>` with AVIF and WebP support.
- Remote image patterns scoped to known CDN domains (CloudFront, Unsplash).
- SWR client-side caching with `revalidateOnFocus` for freshness.
- Tailwind CSS (zero-runtime) — no runtime CSS overhead.
- Code splitting via Next.js App Router (automatic per-route chunks).

**Backend:**
- CloudFront signed URL cache: 5,000 URLs in-memory with LRU eviction
  (cache duration = half of URL lifetime).
- Prisma connection via `@prisma/adapter-pg` for efficient connection
  pooling.
- Image processor uses configurable batch sizes and poll intervals to
  balance throughput vs. resource consumption.
- Sharp operations wrapped in `withTimeout()` (60s default) to prevent
  hung processes.
- `Promise.allSettled()` for batch S3 operations to tolerate individual
  failures without blocking the batch.
- Bull/BullMQ queues with `removeOnComplete` to prevent Redis memory
  growth.

**Storage:**
- S3 Intelligent-Tiering storage class for cost optimization.
- Multipart uploads: 10MB chunk size, 500MB max file size, 500 files per
  batch.
- Presigned URL TTL: 2 hours for uploads, 5 minutes for downloads.

## Security Practices

**Authentication:**
- better-auth with Prisma adapter, supporting email/password (min 8
  chars), Google OAuth (offline access), GitHub OAuth, and email OTP.
- Multi-session support with `impersonatedBy` field for admin audit trail.
- Cross-subdomain cookies: `secure: true`, `httpOnly: true`,
  `sameSite: "none"` for `.fotno.com`.
- Trusted origins whitelist (14 origins: localhost dev + production
  domains).

**Authorization:**
- `isAuth` middleware: session verification via `auth.api.getSession()`.
- `isAdmin` middleware: role-based (`session.user.role === "admin"`).
- `isActiveSubscriber` middleware: subscription + storage limit
  enforcement.
- Storage guard middleware: BigInt arithmetic for quota validation before
  upload acceptance.

**API security:**
- CORS with explicit origin whitelist and `credentials: true`.
- Helmet headers on upload service.
- Body parser size limits (1MB JSON).
- Stripe webhook signature verification with raw body capture.
- Express `trust proxy` for `X-Forwarded-For` behind reverse proxy.

**Data protection:**
- Passwords hashed via better-auth (bcrypt).
- CloudFront signed URLs with RSA key pair for time-limited media access.
- S3 presigned URLs with checksum validation.
- OAuth refresh tokens stored in database (not encrypted at rest — see
  Missing Governance Areas).

## Testing Strategy

**Current state: No automated test infrastructure exists.**

- No test files (`.test.ts`, `.spec.ts`) found in any app or package.
- No test framework configured (no Jest, Vitest, or Playwright config).
- No CI/CD pipeline to enforce test gates.
- Manual testing is the current validation approach.

## Missing Governance Areas

The following standards are absent and recommended based on the detected
architecture:

1. **Automated testing** — No test framework, test files, or coverage
   requirements. Recommended: Vitest for unit/integration tests, Playwright
   for E2E tests across the 5 Next.js apps.
2. **CI/CD pipeline** — No GitHub Actions or equivalent. Recommended:
   lint + type-check + test + Docker build on PR; auto-deploy to Coolify
   on merge to `main`.
3. **Secret management** — `.env` and `.env.prod` contain real credentials
   and are accessible in the repository. Recommended: external secret
   manager (Coolify secrets, AWS Secrets Manager, or 1Password).
4. **`.env.example` file** — No template exists for required environment
   variables. Recommended: checked-in `.env.example` with placeholder
   values.
5. **Rate limiting** — No application-level rate limiting on any endpoint.
   Recommended: `express-rate-limit` on authentication, upload, and webhook
   endpoints.
6. **CSRF protection** — No CSRF tokens implemented. Mitigated partially
   by `sameSite` cookies and CORS, but explicit protection recommended for
   state-changing POST endpoints.
7. **Encryption at rest** — OAuth refresh tokens and session data stored
   unencrypted in PostgreSQL. Recommended: field-level encryption for
   sensitive columns.
8. **Audit logging** — No structured audit trail for admin actions
   (impersonation, tier changes, user bans). Recommended: dedicated audit
   log table with actor, action, target, timestamp.
9. **API versioning** — No version prefix on API routes. Recommended:
   `/api/v1/` prefix for future backward compatibility.
10. **Database backup strategy** — No documented backup or disaster
    recovery process.
11. **Dependency update policy** — No Dependabot, Renovate, or scheduled
    dependency audits configured.

## Governance

This constitution is the authoritative source of engineering standards for
the Fotno monorepo. All code contributions MUST comply with the Core
Principles above.

**Amendment procedure:**
1. Propose changes in a feature branch with a clear description of what
   changed and why.
2. Update the Sync Impact Report (HTML comment at the top of this file).
3. Increment the version according to semver:
   - MAJOR: Principle removal or incompatible redefinition.
   - MINOR: New principle, section addition, or material expansion.
   - PATCH: Clarification, wording, or non-semantic refinement.
4. Update `LAST_AMENDED_DATE` to the date of the change.
5. Propagate changes to dependent templates (`plan-template.md`,
   `spec-template.md`, `tasks-template.md`) if principles affect their
   structure.

**Compliance review:**
- The plan template's "Constitution Check" section MUST reference this
  document's Core Principles before implementation begins.
- Complexity violations MUST be documented in the plan's "Complexity
  Tracking" table with justification.
- Feature specifications MUST align functional requirements with the
  technology choices mandated here.

**Version**: 1.0.0 | **Ratified**: 2026-03-28 | **Last Amended**: 2026-03-28
