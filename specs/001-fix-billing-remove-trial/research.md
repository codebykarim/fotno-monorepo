# Research: Fix Billing Downgrade & Remove Trial Period

**Branch**: `001-fix-billing-remove-trial`
**Date**: 2026-03-28

## R1: Downgrade Bug Root Cause

**Decision**: The downgrade bug has two interrelated root causes that must
both be fixed.

**Root Cause 1 — Database not updated for downgrades**

In `apps/backend/src/services/SubscriptionServices/updateSubscription.ts`,
the `changeTier()` function (lines 56-89) sends the price change to
Stripe but only updates the local database for **upgrades** (lines 69-87).
For downgrades, the code comment says "the webhook will handle the change
at period end" — but the webhook handler is unreliable (see Root Cause 2).

```
changeTier() → isUpgrade?
  YES → Stripe update + DB update (immediate)
  NO  → Stripe update only (no DB update, defer to webhook)
```

**Root Cause 2 — Webhook falls back to old plan data**

In `apps/backend/src/services/SubscriptionServices/handleWebhook.ts`,
`handleSubscriptionUpdated()` (line 284) resolves the tier via:

```typescript
const tierGb = tierGbFromMeta ?? tier?.gb ?? subscription.storageTierGb;
```

If `findTierByPriceId(stripePriceId)` returns `undefined` (price ID
mismatch between env vars and Stripe), and no `tier_gb` metadata exists,
the fallback is `subscription.storageTierGb` — which is the **old** plan's
value since the DB was never updated during the downgrade.

**Rationale**: Fix both issues:
1. Make `changeTier()` update the DB for all plan changes (not just
   upgrades), so the local state always reflects the intended plan.
2. Make the webhook handler more robust by always resolving the tier from
   the Stripe price ID first, and logging an error (not silently falling
   back) if resolution fails.

**Alternatives considered**:
- *Fix only the webhook*: Rejected because the DB would still be stale
  during the pending period, causing incorrect billing page display.
- *Fix only `changeTier()`*: Rejected because the webhook should still
  correctly handle events regardless of prior DB state.

## R2: Downgrade Timing — Stripe Behavior

**Decision**: Downgrades use `proration_behavior: "none"` and take effect
at the next billing period end. This is the existing behavior and matches
the spec clarification.

**Rationale**: The current `changeTier()` code already passes
`proration_behavior: isUpgrade ? "create_prorations" : "none"` to Stripe.
For downgrades, Stripe schedules the price change for the next billing
cycle — the user keeps the current plan until then.

**Implementation note**: When fixing `changeTier()` to update the DB for
downgrades, we should NOT update `storageTierGb` and `storageLimit`
immediately. Instead, store the pending target tier so the billing page can
show "Switching to Starter on [date]". The actual storage limit change
happens when the webhook fires at period end.

**Alternatives considered**:
- *Immediate downgrade with proration*: Rejected per spec clarification —
  user retains current plan benefits until period end.

## R3: Trial Period — Scope of Removal

**Decision**: Remove all trial-related code, data, and UI across 19 source
files spanning backend, dashboard, landing, auth, admin, and upload service.

**Rationale**: The business model shifts to a permanent free tier (no time
limit) with immediate paid subscriptions. The trial created confusion and
added complexity to billing logic.

**Files requiring changes** (grouped by area):

### Database (Prisma)
- `packages/db/prisma/schema.prisma`: Remove `TRIAL` from Plan enum,
  remove `trialEndsAt` from User model.
- New migration: Migrate existing TRIAL users to FREE, drop column and
  enum value.

### Backend Services
- `apps/backend/src/services/SubscriptionServices/resolveUserAccess.ts`:
  Remove `TRIAL_DAYS` constant, `trialEndsAt` logic, `isTrialing` status,
  `trialDaysLeft` calculation. Remove "trialing" from `UserAccessStatus`.
- `apps/backend/src/services/SubscriptionServices/cancelSubscription.ts`:
  Remove trial detection logic (lines 32-43), `trialEndsAt: null` reset.
- `apps/backend/src/services/SubscriptionServices/handleWebhook.ts`:
  Remove `trialEnd` extraction (line 184), `trialEndsAt` in user update
  (line 216).
- `apps/backend/src/controllers/BillingController.ts`: Remove
  `trialDaysLeft` from response (line 54).
- `apps/backend/src/services/DashboardServices/resolveOwnerUserId.ts`:
  Change default `plan: "TRIAL"` → `plan: "FREE"` (line 18).
- `apps/backend/src/services/DashboardServices/uploadServiceClient.ts`:
  Change default `plan: "TRIAL"` → `plan: "FREE"` (line 46).

### Upload Service
- `apps/upload-service/src/middleware/auth.middleware.ts`: Change default
  `plan: 'TRIAL'` → `plan: 'FREE'` (line 48).

### Dashboard Frontend
- `apps/dashboard/components/trial-banner.tsx`: Delete entire file.
- `apps/dashboard/app/layout.tsx`: Remove TrialBanner import and usage.
- `apps/dashboard/app/billing/page.tsx`: Remove trial status checks,
  trial badge rendering, `trialDaysLeft` references.
- `apps/dashboard/lib/types/api.ts`: Remove `"trialing"` from
  `UserAccessStatus`, remove `trialEndsAt` and `trialDaysLeft` from
  `SubscriptionResponse`.

### Landing Frontend
- `apps/landing/components/Hero.tsx`: Change "Start free trial" →
  "Get started free" (line 121).
- `apps/landing/components/CallToAction.tsx`: Change "Start free trial" →
  "Get started free" (line 43).

### Auth Frontend
- `apps/auth/app/layout.tsx`: Update meta description to remove
  "Free trial available." (line 19).

### Admin Frontend
- `apps/admin/components/status-badge.tsx`: Remove TRIAL badge styling
  (line 27).
- `apps/admin/components/users-page.tsx`: Remove "TRIAL" from PLANS
  filter array, add "FREE" (line 12).
- `apps/admin/components/analytics-page.tsx`: Remove TRIAL color coding
  (line 142).

**Alternatives considered**:
- *Soft-disable trial (feature flag)*: Rejected — adds complexity without
  benefit since the decision to remove trial is final.
- *Keep TRIAL enum value but never assign it*: Rejected — dead code
  creates confusion and maintenance burden.

## R4: Stripe Product Configuration

**Decision**: Verify and remove any trial period configured on the Stripe
product/price level via Stripe Dashboard. This is an operational step, not
a code change.

**Rationale**: The code does not pass `trial_period_days` to
`checkout.sessions.create()`, but Stripe may have a default trial period
configured on the product. If so, Stripe will still send `trial_end` in
webhook events, which the code currently stores.

**Alternatives considered**:
- *Ignore Stripe-side config*: Rejected — even if code stops reading
  `trial_end`, having mismatched config is confusing.

## R5: Pending Downgrade UI

**Decision**: When a downgrade is pending (scheduled for period end), the
billing page should show the current active plan plus a notice indicating
the upcoming change and its effective date.

**Rationale**: Stripe's subscription object includes
`schedule` or `cancel_at_period_end` data, and the subscription items
reflect the upcoming price change. The `currentPeriodEnd` field is already
stored and displayed. We can use the Stripe subscription's pending update
info to show the scheduled downgrade.

**Implementation approach**: After `changeTier()` updates Stripe for a
downgrade, store the pending tier info locally (e.g., `pendingTierGb` on
the Subscription model or derive it from Stripe at read time). The billing
page reads this and shows "Switching to [plan] on [date]".

**Alternatives considered**:
- *Query Stripe API on every billing page load*: Rejected — adds latency
  and API call overhead.
- *No pending indicator*: Rejected per FR-012 — spec requires it.
