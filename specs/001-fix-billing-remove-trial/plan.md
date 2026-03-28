# Implementation Plan: Fix Billing Downgrade & Remove Trial Period

**Branch**: `001-fix-billing-remove-trial` | **Date**: 2026-03-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-billing-remove-trial/spec.md`

## Summary

Fix a plan downgrade bug where switching to a lower tier silently reverts
to the previous plan (caused by missing DB updates for downgrades and
unreliable webhook tier resolution). Simultaneously remove the 14-day trial
period from the entire system — database schema, backend services, frontend
UI across 5 apps, and upload service — replacing it with a permanent free
tier as the default entry point.

## Technical Context

**Language/Version**: TypeScript 5.5+ on Node.js >=20
**Primary Dependencies**: Express 4/5, Prisma 7.5, Stripe SDK, better-auth,
Next.js 16, React 19, Tailwind CSS 4, SWR, Zustand, Zod, Joi
**Storage**: PostgreSQL (Prisma ORM with `@prisma/adapter-pg`), Redis
(Bull/BullMQ queues)
**Testing**: Manual testing (no automated test infrastructure)
**Target Platform**: Docker containers on Coolify (self-hosted PaaS)
**Project Type**: Multi-service SaaS monorepo (5 Next.js apps + 3 Node.js
backend services)
**Performance Goals**: N/A — bug fix and feature removal, no new
performance requirements
**Constraints**: Migration must handle existing TRIAL users without data
loss. Stripe product-level trial config must be verified manually.
**Scale/Scope**: ~19 source files modified across 8 services, 1 new Prisma
migration, 2 new Subscription fields (`pendingTierGb`, `pendingEffectiveAt`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Monorepo Cohesion | PASS | All changes within existing apps/ and packages/. No new packages. |
| II. Strict TypeScript | PASS | All changes in TypeScript. Removing types (trialing, trialEndsAt) tightens type safety. |
| III. Server-First Rendering | PASS | No new client components. Removing trial-banner.tsx reduces client-side code. |
| IV. Shared UI Consistency | PASS | No new UI components. Removing trial banner from @workspace/ui consumers. |
| V. Domain-Scoped Backend | PASS | Changes stay within SubscriptionServices domain. Webhook handler and changeTier are in correct service scope. |
| VI. Containerized Deployment | PASS | Prisma migration runs automatically on container startup. No Dockerfile changes. |
| VII. Subscription-Gated Access | PASS | Fixing the middleware chain to correctly enforce tier limits on downgrade. Storage guard logic unchanged. |

No violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-billing-remove-trial/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: root cause analysis
├── data-model.md        # Phase 1: schema changes
├── quickstart.md        # Phase 1: verification steps
├── contracts/
│   └── api-changes.md   # Phase 1: API contract changes
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
packages/db/
├── prisma/
│   ├── schema.prisma                    # Plan enum, User model changes
│   └── migrations/
│       └── YYYYMMDD_remove_trial/       # New migration
│           └── migration.sql
└── src/seed.ts                          # Verify seed doesn't use TRIAL

apps/backend/src/
├── services/SubscriptionServices/
│   ├── updateSubscription.ts            # Fix changeTier() for downgrades
│   ├── handleWebhook.ts                 # Fix tier resolution + remove trial
│   ├── resolveUserAccess.ts             # Remove trial logic
│   └── cancelSubscription.ts            # Remove trial logic
├── services/DashboardServices/
│   ├── resolveOwnerUserId.ts            # TRIAL → FREE default
│   └── uploadServiceClient.ts           # TRIAL → FREE default
└── controllers/BillingController.ts     # Remove trialDaysLeft, add pending

apps/upload-service/src/
└── middleware/auth.middleware.ts         # TRIAL → FREE default

apps/dashboard/
├── components/trial-banner.tsx          # DELETE
├── app/layout.tsx                       # Remove TrialBanner
├── app/billing/page.tsx                 # Remove trial UI, add pending UI
└── lib/types/api.ts                     # Remove trial types, add pending

apps/landing/components/
├── Hero.tsx                             # CTA text change
└── CallToAction.tsx                     # CTA text change

apps/auth/app/
└── layout.tsx                           # Meta description change

apps/admin/components/
├── status-badge.tsx                     # Remove TRIAL badge
├── users-page.tsx                       # Remove TRIAL filter, add FREE
└── analytics-page.tsx                   # Remove TRIAL color
```

**Structure Decision**: Existing monorepo structure. All changes modify
existing files within their current domain-scoped locations. One file
deleted (`trial-banner.tsx`). One new Prisma migration created. No new
apps or packages.

## Complexity Tracking

> No Constitution Check violations. Table not required.
