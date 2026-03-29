# API Contracts: Onboarding Flow with Stripe Subscription Step

**Branch**: `002-onboarding-stripe-flow` | **Date**: 2026-03-29

## New Endpoints

### POST /api/billing/create-subscription-intent

Creates a Stripe subscription with an incomplete payment intent for inline payment collection via Stripe Elements.

**Auth**: Required
**Request**:
```json
{
  "tierLabel": "Professional",
  "countryCode": "US"
}
```

**Success Response** (201):
```json
{
  "data": {
    "subscriptionId": "sub_xxx",
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

**Error Responses**:
- 400: `{ "error": "Invalid tier" }` — tier label not found
- 400: `{ "error": "Cannot create subscription for free tier" }` — use setup-intent instead
- 401: `{ "error": "Unauthorized" }` — no session
- 409: `{ "error": "User already has an active subscription" }`

**Notes**:
- Creates a Stripe customer if `User.stripeCustomerId` is null
- Uses `payment_behavior: "default_incomplete"` so the subscription starts only after payment confirmation
- Returns `clientSecret` of the PaymentIntent for use with `<PaymentElement>`
- Supports regional pricing via `countryCode`

---

### POST /api/billing/create-setup-intent

Creates a Stripe SetupIntent for saving a card without charging (Free plan card-on-file).

**Auth**: Required
**Request**:
```json
{}
```

**Success Response** (201):
```json
{
  "data": {
    "clientSecret": "seti_xxx_secret_xxx"
  }
}
```

**Error Responses**:
- 401: `{ "error": "Unauthorized" }` — no session
- 409: `{ "error": "User already has a payment method" }`

**Notes**:
- Creates a Stripe customer if `User.stripeCustomerId` is null
- Returns `clientSecret` for use with `<PaymentElement>` in setup mode

---

### POST /api/user/complete-onboarding

Marks the user's onboarding as complete, allowing dashboard access.

**Auth**: Required
**Request**:
```json
{}
```

**Success Response** (200):
```json
{
  "data": {
    "finishOnboarding": true
  }
}
```

**Error Responses**:
- 401: `{ "error": "Unauthorized" }` — no session

**Notes**:
- Sets `User.finishOnboarding = true`
- Idempotent — calling again on a completed user is a no-op (still returns 200)

---

## Modified Endpoints

### GET /api/billing/plans

No changes to the endpoint itself. The onboarding Stripe step fetches plans from this endpoint to display pricing details for the selected tier.

---

## Frontend Routes (Auth App)

### /onboarding

Multi-step onboarding page in the auth app.

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `plan` | string | `"Free"` | Selected plan tier label |
| `step` | string | `"account"` | Current step: `"account"` or `"stripe"` |
| `resume` | string | — | If `"true"`, indicates user is resuming (redirected from dashboard) |

**Behavior**:
- If user has no session → show account info step
- If user has session but `finishOnboarding === false` → show Stripe step
- If user has session and `finishOnboarding === true` → redirect to dashboard
- OAuth users land here with `step=stripe` after OAuth callback

---

## Dashboard Middleware Change

### Onboarding Gate

Added to the existing middleware in `apps/dashboard/middleware.ts`:

**Logic**: After session check passes, if `session.user.finishOnboarding !== true`, redirect to `${NEXT_PUBLIC_AUTH_URL}/onboarding?resume=true`.

**Exceptions**: No routes are exempt from the onboarding check (unlike `/payment-callback` which is exempt from subscription checks). The onboarding check happens before any other access checks.
