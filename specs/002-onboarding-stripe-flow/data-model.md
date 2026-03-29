# Data Model: Onboarding Flow with Stripe Subscription Step

**Branch**: `002-onboarding-stripe-flow` | **Date**: 2026-03-29

## Existing Entities (Modified)

### User

The existing User model already has the `finishOnboarding` field. No schema changes required.

| Field | Type | Default | Change |
|-------|------|---------|--------|
| `finishOnboarding` | Boolean? | false | **No change** — already exists, currently unused. Will now be actively read/written. |

**State transitions for `finishOnboarding`**:
- `false` → User created (signup or OAuth). Default state.
- `true` → User completes onboarding (Stripe step completed or skipped). Set via `POST /api/user/complete-onboarding`.
- Once `true`, never reverts to `false`.

### Subscription

No changes to the existing Subscription model. Subscriptions created during onboarding use the same model as subscriptions created from the dashboard billing page.

## New Entities

None. The onboarding flow does not require new database tables. The flow state is derived from:
- `User.finishOnboarding` — whether onboarding is complete
- Session presence — whether the user has an account
- Query parameters — which plan was selected, which step to show

## Entity Relationships

```
User (finishOnboarding: false)
  │
  ├── [Onboarding incomplete] → Dashboard middleware redirects to auth/onboarding
  │
  └── [Onboarding complete] → User.finishOnboarding = true
       │
       ├── [Free tier, no card] → No Subscription record
       ├── [Free tier, card saved] → Stripe customer created (User.stripeCustomerId set)
       └── [Paid plan] → Subscription record created via webhook
```

## Validation Rules

- `finishOnboarding` can only transition from `false` to `true`, never back.
- The `complete-onboarding` endpoint MUST require authentication.
- Plan selection passed via query parameter MUST be validated against known tier labels (Free, Starter, Professional, Business, Unlimited).
- If an unknown plan is provided, default to Free.

## Key Queries

1. **Check onboarding status** (dashboard middleware): Read `session.user.finishOnboarding` from the session — no extra DB query needed since it's part of the session payload.
2. **Complete onboarding** (auth app → backend): `UPDATE user SET finishOnboarding = true WHERE id = :userId`.
3. **Create subscription** (Stripe step): Uses existing subscription creation logic from webhook handler (`checkout.session.completed`).
