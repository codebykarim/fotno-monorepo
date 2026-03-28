# API Contract Changes: Fix Billing Downgrade & Remove Trial Period

**Branch**: `001-fix-billing-remove-trial`
**Date**: 2026-03-28

## 1. GET /api/billing/account — Subscription Response

### Current Response (with trial)
```json
{
  "access": {
    "status": "trialing",
    "canUpload": true,
    "canCreateGallery": true,
    "storageLimitBytes": "5368709120",
    "galleryLimit": 5,
    "galleryCount": 2,
    "trialEndsAt": "2026-04-11T00:00:00.000Z",
    "trialDaysLeft": 14
  },
  "subscription": { ... }
}
```

### Updated Response (trial removed)
```json
{
  "access": {
    "status": "free | active | past_due | cancelled_grace | no_subscription",
    "canUpload": true,
    "canCreateGallery": true,
    "storageLimitBytes": "1073741824",
    "galleryLimit": 2,
    "galleryCount": 1
  },
  "subscription": { ... }
}
```

**Changes:**
- `status`: Remove `"trialing"` value. Free-tier users return `"free"`.
- Remove `trialEndsAt` field entirely.
- Remove `trialDaysLeft` field entirely.

## 2. GET /api/billing/account — Subscription with Pending Downgrade

### New Response Shape (pending downgrade)
```json
{
  "access": {
    "status": "active",
    "canUpload": true,
    "canCreateGallery": true,
    "storageLimitBytes": "107374182400"
  },
  "subscription": {
    "storageTierGb": 100,
    "priceCents": 1900,
    "currentPeriodEnd": "2026-04-28T00:00:00.000Z",
    "status": "ACTIVE",
    "pendingDowngrade": {
      "tierGb": 20,
      "tierLabel": "Starter",
      "effectiveAt": "2026-04-28T00:00:00.000Z"
    }
  }
}
```

**Changes:**
- Add optional `pendingDowngrade` object to subscription response.
- Contains `tierGb`, `tierLabel`, and `effectiveAt` for the scheduled
  plan change.
- `null` or absent when no downgrade is pending.

## 3. PATCH /api/billing/change-tier — No Contract Change

Request and response shape remain the same:

**Request:**
```json
{ "newStorageTierGb": 20 }
```

**Success Response:**
```json
{ "message": "Plan updated successfully" }
```

**Behavior change (internal):**
- Downgrades now also update the local database (store pending tier info).
- Previously, downgrades only sent to Stripe and deferred DB update to
  webhook.

## 4. Stripe Webhook — customer.subscription.updated

**Internal behavior change (no external contract):**
- Tier resolution must reliably identify the new plan from the Stripe
  price ID.
- Remove fallback to `subscription.storageTierGb` when price ID lookup
  fails — log error instead.
- On successful resolution at period end: clear `pendingTierGb` and apply
  the new tier to the subscription and user records.
- Remove `trialEnd` extraction and `trialEndsAt` user update.

## 5. Type Definition Changes (Frontend)

### UserAccessStatus
```typescript
// Before
export type UserAccessStatus =
  | "free"
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled_grace"
  | "no_subscription";

// After
export type UserAccessStatus =
  | "free"
  | "active"
  | "past_due"
  | "cancelled_grace"
  | "no_subscription";
```

### SubscriptionResponse
```typescript
// Remove from access:
trialEndsAt?: string | null;
trialDaysLeft?: number;

// Add to subscription:
pendingDowngrade?: {
  tierGb: number;
  tierLabel: string;
  effectiveAt: string;
} | null;
```
