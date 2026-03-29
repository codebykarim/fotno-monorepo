# Quickstart: Onboarding Flow with Stripe Subscription Step

**Branch**: `002-onboarding-stripe-flow` | **Date**: 2026-03-29

## Prerequisites

- Node.js >=20
- pnpm 9.12+
- Running PostgreSQL with current schema migrated
- Running Redis instance
- Stripe test mode API keys (secret key + publishable key)
- Stripe webhook secret (for local testing, use Stripe CLI)

## Environment Variables

Add to `.env`:
```
# Already exists:
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# New (for Stripe Elements in auth app):
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

The `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` must be added to the auth app's environment so the frontend can initialize Stripe.js.

## Local Development Setup

1. Install new dependencies in the auth app:
   ```bash
   pnpm --filter auth add @stripe/stripe-js @stripe/react-stripe-js
   ```

2. Start the full stack:
   ```bash
   pnpm dev
   ```

3. Forward Stripe webhooks locally (in a separate terminal):
   ```bash
   stripe listen --forward-to localhost:8000/api/billing/webhook
   ```

## Testing the Flow

### Free Plan (skip Stripe)
1. Go to `http://localhost:3000` (landing)
2. Click "Get started free"
3. Fill in email, name, password → Continue
4. On Stripe step, click "Skip"
5. Verify redirect to `http://localhost:3001` (dashboard)

### Paid Plan (subscribe)
1. Go to `http://localhost:3000` (landing)
2. Click a paid plan (e.g., Professional)
3. Fill in email, name, password → Continue
4. Enter Stripe test card: `4242 4242 4242 4242`, any future date, any CVC
5. Verify redirect to dashboard with Professional plan active

### Free Plan (save card)
1. Same as Free Plan flow but enter card details instead of skipping
2. Verify no charge in Stripe dashboard, card saved as payment method

### OAuth Flow
1. Click Google/GitHub sign-in
2. After OAuth callback, verify Stripe step appears (no account info step)
3. Skip or pay, verify dashboard access

### Resume Flow
1. Create account, close browser before completing Stripe step
2. Navigate to `http://localhost:3001` (dashboard)
3. Verify redirect to `http://localhost:3002/onboarding?resume=true`
4. Complete or skip Stripe step
5. Verify dashboard access

## Key Files to Modify

| Area | Files |
|------|-------|
| Landing page buttons | `apps/landing/components/Hero.tsx`, `CallToAction.tsx`, `Header.tsx`, `Pricing.tsx` |
| Auth onboarding page | `apps/auth/app/onboarding/page.tsx` (new) |
| Auth onboarding components | `apps/auth/components/onboarding/` (new directory) |
| Auth layout (Rybbit) | `apps/auth/app/layout.tsx` |
| Auth next.config (rewrites) | `apps/auth/next.config.ts` |
| Auth signup redirect | `apps/auth/components/unified-auth-form.tsx` |
| Dashboard middleware | `apps/dashboard/middleware.ts` |
| Backend billing routes | `apps/backend/src/routes/billingRoutes.ts` |
| Backend new endpoints | `apps/backend/src/services/SubscriptionServices/createSubscriptionIntent.ts` (new), `createSetupIntent.ts` (new) |
| Backend user routes | `apps/backend/src/routes/userRoutes.ts` |
| Backend complete-onboarding | `apps/backend/src/services/UserServices/completeOnboarding.ts` (new) |
