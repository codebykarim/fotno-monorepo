# Implementation Plan: Onboarding Flow with Stripe Subscription Step

**Branch**: `002-onboarding-stripe-flow` | **Date**: 2026-03-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-onboarding-stripe-flow/spec.md`

## Summary

Add a multi-step onboarding flow that intercepts new users before they reach the dashboard. The flow collects account info (email, name, password), then presents an inline Stripe payment step where users can subscribe to a paid plan, save a card for later (free plan), or skip entirely. The existing `finishOnboarding` flag on the User model gates dashboard access. Stripe Elements is embedded inline (no redirect). The flow lives in the auth app with tracking via Rybbit.

## Technical Context

**Language/Version**: TypeScript 5.5+ on Node.js >=20
**Primary Dependencies**: Next.js 16, React 19, Express 4, Prisma 7.5, better-auth 1.5, Stripe SDK, @stripe/stripe-js (new), @stripe/react-stripe-js (new)
**Storage**: PostgreSQL (existing schema, no migrations needed)
**Testing**: Manual (no test framework in place)
**Target Platform**: Web (5 Next.js apps + 3 Node.js services on Coolify/Docker)
**Project Type**: Multi-service monorepo (web SaaS)
**Performance Goals**: Onboarding flow completes in under 3 minutes; Stripe Elements loads in under 2 seconds
**Constraints**: Cross-subdomain auth cookies (.fotno.com); Stripe Elements requires HTTPS in production
**Scale/Scope**: Launch-phase product; moderate user volume expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Monorepo Cohesion | Pass | Onboarding flow in `apps/auth/`, new backend endpoints in `apps/backend/`. Shared packages used via `@workspace/*`. No new apps or packages created. |
| II. Strict TypeScript | Pass | All new code in TypeScript with `strict: true`. Stripe types from `@stripe/stripe-js`. |
| III. Server-First Rendering | Pass | Onboarding page uses server components for layout/data fetching. `"use client"` only for interactive form components (Stripe Elements, account form). |
| IV. Shared UI Consistency | Pass | Onboarding forms use `@workspace/ui` components (Button, Input, Card, Form). Styling via Tailwind + `cn()`. No new UI primitives needed. |
| V. Domain-Scoped Backend Services | Pass | New endpoints follow existing patterns: routes in `billingRoutes.ts` and `userRoutes.ts`, services return `{ data, status }` objects. |
| VI. Containerized Deployment | Pass | No new services or Dockerfiles. Auth app and backend already have Docker configs. Only new env var: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for auth app. |
| VII. Subscription-Gated Access | Pass | Onboarding respects existing subscription model. Free tier defaults loaded from `PricingTier` table. Stripe webhook verification unchanged. |

**Post-Phase 1 Re-check**: All gates still pass. No new apps or packages introduced. Stripe Elements client library added to auth app only.

## Project Structure

### Documentation (this feature)

```text
specs/002-onboarding-stripe-flow/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research decisions
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 quickstart guide
├── contracts/
│   └── api.md           # Phase 1 API contracts
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
apps/
├── landing/
│   └── components/
│       ├── Hero.tsx              # Modified: add ?plan= param to Get Started URL
│       ├── CallToAction.tsx      # Modified: add ?plan= param to Get Started URL
│       ├── Header.tsx            # Modified: add ?plan= param to Get Started URL
│       └── Pricing.tsx           # Modified: add ?plan=<tier> param to plan button URLs
├── auth/
│   ├── app/
│   │   ├── layout.tsx            # Modified: add Rybbit script
│   │   └── onboarding/
│   │       └── page.tsx          # New: onboarding page (server component)
│   ├── components/
│   │   ├── unified-auth-form.tsx # Modified: redirect to /onboarding after signup
│   │   └── onboarding/          # New directory
│   │       ├── onboarding-flow.tsx        # New: client component orchestrating steps
│   │       ├── account-info-step.tsx      # New: email/name/password form (reuses signup logic)
│   │       └── stripe-step.tsx            # New: Stripe Elements payment/setup form
│   └── next.config.ts            # Modified: add Rybbit rewrites
├── dashboard/
│   └── middleware.ts             # Modified: add finishOnboarding check
└── backend/
    └── src/
        ├── routes/
        │   ├── billingRoutes.ts          # Modified: add create-subscription-intent, create-setup-intent
        │   └── userRoutes.ts             # Modified: add complete-onboarding
        ├── services/
        │   ├── SubscriptionServices/
        │   │   ├── createSubscriptionIntent.ts  # New: create Stripe subscription with incomplete PI
        │   │   └── createSetupIntent.ts         # New: create Stripe SetupIntent for card saving
        │   └── UserServices/
        │       └── completeOnboarding.ts        # New: set finishOnboarding = true
        └── controllers/
            ├── BillingController.ts      # Modified: add new controller methods
            └── UserController.ts         # Modified: add completeOnboarding controller
```

**Structure Decision**: No new apps or packages. Changes span 4 existing apps (landing, auth, dashboard, backend) with new files only in auth app components and backend services. This aligns with the monorepo structure and avoids unnecessary complexity.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
