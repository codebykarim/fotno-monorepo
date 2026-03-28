# Quickstart: Fix Billing Downgrade & Remove Trial Period

**Branch**: `001-fix-billing-remove-trial`
**Date**: 2026-03-28

## Verification Steps

### Pre-requisites
1. Run `pnpm db:generate` to regenerate Prisma client after schema change.
2. Run `pnpm db:deploy` (or `pnpm db:migrate` in dev) to apply the
   migration that removes TRIAL and trialEndsAt.
3. Ensure Stripe test API keys are configured in `.env`.

### Test 1: Plan Downgrade Fix (SC-001, SC-005)

1. Sign up or use an existing test account.
2. Subscribe to the **Professional** plan (100 GB) via the billing page.
3. After subscription is active, click **Downgrade** on the **Starter**
   plan (20 GB).
4. **Expected**: Toast confirms plan change scheduled.
5. **Expected**: Billing page shows current plan (Professional) with a
   notice: "Switching to Starter on [date]".
6. Simulate or wait for Stripe webhook `customer.subscription.updated` at
   period end.
7. **Expected**: After webhook processes, billing page shows Starter plan
   with 20 GB storage limit.
8. **Repeat** for Business → Professional, Business → Starter, and
   Unlimited → any lower tier.

### Test 2: Plan Upgrade Still Works (SC-005)

1. From Starter (20 GB), click **Upgrade** on Professional (100 GB).
2. **Expected**: Plan updates immediately to Professional with 100 GB.
3. **Expected**: Stripe shows prorated charge.

### Test 3: Trial Removed — New User (SC-003)

1. Sign up as a new user.
2. **Expected**: Account shows plan = "Free" (not "Trial").
3. **Expected**: Storage limit matches free-tier configuration.
4. **Expected**: No trial banner, trial countdown, or trial messaging
   anywhere in the dashboard.

### Test 4: Trial Removed — Existing Users (SC-004)

1. Before migration: note any users with plan = "TRIAL" in the database.
2. Run the migration.
3. **Expected**: All former TRIAL users now have plan = "FREE".
4. **Expected**: `trialEndsAt` column no longer exists.

### Test 5: Trial Removed — UI Audit (SC-002)

Verify zero "trial" references in user-facing UI:

| App       | Page / Component        | Expected                          |
|-----------|------------------------|-----------------------------------|
| Landing   | Hero section            | CTA says "Get started free"       |
| Landing   | Call-to-action section  | CTA says "Get started free"       |
| Auth      | Page meta description   | No "trial" in description         |
| Dashboard | Layout                  | No TrialBanner component          |
| Dashboard | Billing page            | No trial badge or days remaining  |
| Admin     | Users page              | No "TRIAL" filter option          |
| Admin     | Analytics page          | No TRIAL color coding             |
| Admin     | Status badges           | No TRIAL badge style              |

### Test 6: Cancellation Reverts to Free (US2-AS6)

1. Subscribe to any paid plan.
2. Cancel the subscription.
3. After grace period, **Expected**: Plan shows "Free" (not "Trial" or
   "Expired" reverting to Trial).

### Test 7: Pending Downgrade UI (FR-012)

1. Subscribe to Professional.
2. Downgrade to Starter.
3. **Expected**: Billing page shows current plan (Professional) plus
   "Switching to Starter on [renewal date]".
4. **Expected**: Current storage limit remains 100 GB until period end.
