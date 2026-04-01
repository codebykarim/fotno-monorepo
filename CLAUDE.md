# monorepo Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-31

## Active Technologies
- TypeScript 5.5+ on Node.js >=20 + Next.js 16, React 19, Express 4, Prisma 7.5, better-auth 1.5, Stripe SDK, @stripe/stripe-js (new), @stripe/react-stripe-js (new) (002-onboarding-stripe-flow)
- PostgreSQL (existing schema, no migrations needed) (002-onboarding-stripe-flow)
- TypeScript 5.5+ on Node.js ≥20 + Next.js 16, React 19, Express 4, Prisma 7.5, Stripe SDK (+ Stripe Connect), Sharp, Zustand, SWR (003-smart-album-workflow)
- PostgreSQL (new models), S3/CloudFront (image access + export storage) (003-smart-album-workflow)

- TypeScript 5.5+ on Node.js >=20 + Express 4/5, Prisma 7.5, Stripe SDK, better-auth, (001-fix-billing-remove-trial)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.5+ on Node.js >=20: Follow standard conventions

## Recent Changes
- 003-smart-album-workflow: Added TypeScript 5.5+ on Node.js ≥20 + Next.js 16, React 19, Express 4, Prisma 7.5, Stripe SDK (+ Stripe Connect), Sharp, Zustand, SWR
- 002-onboarding-stripe-flow: Added TypeScript 5.5+ on Node.js >=20 + Next.js 16, React 19, Express 4, Prisma 7.5, better-auth 1.5, Stripe SDK, @stripe/stripe-js (new), @stripe/react-stripe-js (new)

- 001-fix-billing-remove-trial: Added TypeScript 5.5+ on Node.js >=20 + Express 4/5, Prisma 7.5, Stripe SDK, better-auth,

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
