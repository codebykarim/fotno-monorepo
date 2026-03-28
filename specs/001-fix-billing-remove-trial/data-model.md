# Data Model: Fix Billing Downgrade & Remove Trial Period

**Branch**: `001-fix-billing-remove-trial`
**Date**: 2026-03-28

## Schema Changes

### 1. Plan Enum — Remove TRIAL

**Current:**
```prisma
enum Plan {
  FREE
  TRIAL
  PRO
  EXPIRED
}
```

**Target:**
```prisma
enum Plan {
  FREE
  PRO
  EXPIRED
}
```

### 2. User Model — Remove trialEndsAt

**Current fields (affected):**
```prisma
model User {
  plan               Plan             @default(FREE)
  trialEndsAt        DateTime?        // REMOVE
  // ... other fields unchanged
}
```

**Target:**
```prisma
model User {
  plan               Plan             @default(FREE)
  // trialEndsAt removed
  // ... other fields unchanged
}
```

### 3. Subscription Model — Add pendingTierGb (optional)

To support FR-012 (pending downgrade indicator), consider adding:

```prisma
model Subscription {
  // ... existing fields
  pendingTierGb      Int?             // Set on downgrade, cleared on webhook
  pendingEffectiveAt DateTime?        // When the downgrade takes effect
}
```

**Decision**: Store pending tier in the database (chosen over deriving from
Stripe at read time to avoid per-request API calls). See research.md R5.

## Migration Plan

### Migration: Remove Trial, Add Pending Tier

**Step 1**: Migrate existing TRIAL users to FREE
```sql
UPDATE "user"
SET "plan" = 'FREE'::"Plan"
WHERE "plan" = 'TRIAL'::"Plan";
```

**Step 2**: Set storage limit to free-tier default for migrated users
```sql
UPDATE "user"
SET "storageLimit" = (
  SELECT "storageLimit" FROM "PricingTier"
  WHERE "gb" = (SELECT MIN("gb") FROM "PricingTier" WHERE "gb" > 0)
  LIMIT 1
)
WHERE "plan" = 'FREE'::"Plan"
AND "storageLimit" IS NULL;
```

**Step 3**: Drop trialEndsAt column
```sql
ALTER TABLE "user" DROP COLUMN IF EXISTS "trialEndsAt";
```

**Step 4**: Remove TRIAL from Plan enum
```sql
-- Create new enum without TRIAL
CREATE TYPE "Plan_new" AS ENUM ('FREE', 'PRO', 'EXPIRED');

-- Swap columns
ALTER TABLE "user"
  ALTER COLUMN "plan" TYPE "Plan_new"
  USING "plan"::text::"Plan_new";

-- Drop old enum and rename
DROP TYPE "Plan";
ALTER TYPE "Plan_new" RENAME TO "Plan";
```

**Step 5** (if adding pending tier fields):
```sql
ALTER TABLE "Subscription"
  ADD COLUMN "pendingTierGb" INTEGER,
  ADD COLUMN "pendingEffectiveAt" TIMESTAMP(3);
```

## Entity Relationship Changes

```
User (1) ──── (0..1) Subscription
  plan: FREE | PRO | EXPIRED     storageTierGb: Int
  storageLimit: BigInt            pendingTierGb: Int?        [NEW]
  storageTierGb: Int              pendingEffectiveAt: DateTime? [NEW]
  [trialEndsAt: REMOVED]
```

## State Transitions

### Plan Lifecycle (after changes)

```
  Sign Up
    │
    ▼
  FREE ──── Subscribe ────► PRO
    ▲                        │
    │                        │ Cancel
    │                        ▼
    └── Grace Period ── EXPIRED
```

Notes:
- TRIAL state is removed entirely.
- FREE is the only entry state for new users.
- PRO is the active subscription state (all paid tiers).
- EXPIRED is the post-cancellation state after grace period.
- FREE is restored when an EXPIRED user's grace period ends.

### Subscription Tier Change Lifecycle

```
  PRO (Tier A)
    │
    ├── Upgrade ──► PRO (Tier B) [immediate, prorated]
    │
    └── Downgrade ──► PRO (Tier A) + pendingTierGb=B
                        │
                        ▼ [at period end, via webhook]
                      PRO (Tier B) + pendingTierGb=null
```
