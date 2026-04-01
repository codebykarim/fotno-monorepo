# API Contracts: Smart Album Workflow

**Branch**: `003-smart-album-workflow` | **Date**: 2026-03-31

All endpoints follow existing backend patterns: `init()` method-based routing, `isAuth` middleware, Joi validation, `{ data }` / `{ error }` response format.

---

## Photographer Settings (Dashboard Routes)

### GET /api/dashboard/smart-album/config

Get photographer's album configuration and products.

**Auth**: `isAuth`

**Response 200**:
```json
{
  "config": {
    "id": "uuid",
    "enabled": false,
    "paymentMethod": "OUTSIDE_FOTNO",
    "stripeConnectAccountId": null,
    "stripeConnectOnboarded": false
  },
  "products": []
}
```

**Response 404**: Config not yet created (first visit).

---

### PATCH /api/dashboard/smart-album/config

Update album configuration (enable/disable, payment method).

**Auth**: `isAuth`

**Body**:
```json
{
  "enabled": true,
  "paymentMethod": "INSIDE_FOTNO"
}
```

**Response 200**: Updated config object.

**Validation**: `paymentMethod` must be one of `OUTSIDE_FOTNO`, `INSIDE_FOTNO`. If switching to `INSIDE_FOTNO`, Stripe Connect onboarding must be complete.

---

### POST /api/dashboard/smart-album/products

Create a new album product.

**Auth**: `isAuth`, `isActiveSubscriber`

**Body**:
```json
{
  "name": "Classic 12x12 Leather",
  "size": "12x12",
  "coverType": "leather",
  "paperType": "lustre",
  "maxPages": 20,
  "priceCents": 45000,
  "currency": "USD"
}
```

**Response 201**: Created product object.

**Validation**: Unique constraint on `[configId, size, coverType, paperType]`. `maxPages` >= 2, `priceCents` >= 0.

---

### PATCH /api/dashboard/smart-album/products/:productId

Update an existing album product.

**Auth**: `isAuth`

**Body**: Partial product fields (any subset of name, size, coverType, paperType, maxPages, priceCents, currency, isActive).

**Response 200**: Updated product object.

---

### DELETE /api/dashboard/smart-album/products/:productId

Delete an album product. Fails if any active (DRAFT/SUBMITTED) designs reference this product.

**Auth**: `isAuth`

**Response 200**: `{ "deleted": true }`

**Response 409**: `{ "error": "Product is referenced by active album designs" }`

---

## Photographer Submissions (Dashboard Routes)

### GET /api/dashboard/smart-album/submissions

List all album submissions across photographer's galleries.

**Auth**: `isAuth`

**Query params**: `?status=PENDING&galleryId=uuid&page=1&limit=20`

**Response 200**:
```json
{
  "submissions": [
    {
      "id": "uuid",
      "designId": "uuid",
      "version": 1,
      "status": "PENDING",
      "clientName": "Sarah",
      "clientEmail": "sarah@example.com",
      "galleryTitle": "Wedding 2026",
      "productName": "Classic 12x12 Leather",
      "submittedAt": "2026-03-31T10:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

---

### GET /api/dashboard/smart-album/submissions/:submissionId

Get full submission details including design snapshot for review.

**Auth**: `isAuth`

**Response 200**:
```json
{
  "submission": {
    "id": "uuid",
    "designId": "uuid",
    "version": 1,
    "status": "PENDING",
    "designSnapshot": { "cover": {}, "firstPage": {}, "spreads": [], "lastPage": {} },
    "photographerNotes": null,
    "submittedAt": "2026-03-31T10:00:00Z",
    "reviewedAt": null,
    "design": {
      "clientName": "Sarah",
      "clientEmail": "sarah@example.com",
      "title": "Our Wedding Album",
      "product": { "name": "Classic 12x12", "size": "12x12", "coverType": "leather", "priceCents": 45000 }
    },
    "transaction": null
  }
}
```

---

### POST /api/dashboard/smart-album/submissions/:submissionId/review

Photographer takes action on a submission.

**Auth**: `isAuth`

**Body**:
```json
{
  "action": "approve",
  "notes": null
}
```

`action`: one of `approve`, `request_changes`, `reject`.
`notes`: required for `request_changes` and `reject`, optional for `approve`.

**Response 200**: Updated submission with new status.

**Side effects**:
- `approve`: Sets design status to APPROVED, sends client notification.
- `request_changes`: Sets design status to CHANGES_REQUESTED (unlocks editing), sends client notification with notes.
- `reject`: Sets design status to REJECTED, sends client notification with reason.

---

### POST /api/dashboard/smart-album/submissions/:submissionId/export

Generate or retrieve the export package for an approved submission.

**Auth**: `isAuth`

**Response 200** (export ready):
```json
{
  "exportUrl": "https://cdn.fotno.com/exports/...",
  "expiresAt": "2026-03-31T12:00:00Z"
}
```

**Response 202** (export generating):
```json
{
  "status": "generating",
  "estimatedSeconds": 60
}
```

**Response 400**: Submission is not approved.

---

## Photographer Stripe Connect (Dashboard Routes)

### POST /api/dashboard/smart-album/connect/onboard

Create Stripe Connect onboarding link.

**Auth**: `isAuth`

**Response 200**:
```json
{
  "onboardingUrl": "https://connect.stripe.com/..."
}
```

---

### GET /api/dashboard/smart-album/connect/status

Check Stripe Connect account status.

**Auth**: `isAuth`

**Response 200**:
```json
{
  "connected": true,
  "payoutsEnabled": true,
  "chargesEnabled": true
}
```

---

## Client Album Designer (Public Gallery Routes)

### GET /api/public/gallery/:shareToken/smart-album/products

Get available album products for this gallery (only if enabled).

**Auth**: Gallery session token (existing pattern)

**Response 200**:
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Classic 12x12 Leather",
      "size": "12x12",
      "coverType": "leather",
      "paperType": "lustre",
      "maxPages": 20,
      "priceCents": 45000,
      "currency": "USD"
    }
  ]
}
```

**Response 404**: Album creation not enabled for this gallery's photographer.

---

### GET /api/public/gallery/:shareToken/smart-album/layouts

Get available layout templates.

**Auth**: Gallery session token

**Response 200**:
```json
{
  "spreadLayouts": [
    { "id": "full-bleed", "name": "Full Bleed", "slots": 1, "thumbnail": "/layouts/full-bleed.svg" },
    { "id": "two-horizontal", "name": "Two Horizontal", "slots": 2, "thumbnail": "/layouts/two-h.svg" }
  ],
  "singlePageLayouts": [
    { "id": "cover-full", "name": "Full Cover", "slots": 1, "thumbnail": "/layouts/cover-full.svg" }
  ]
}
```

---

### POST /api/public/gallery/:shareToken/smart-album/designs

Create a new album design.

**Auth**: Gallery session token

**Body**:
```json
{
  "productId": "uuid",
  "clientName": "Sarah",
  "clientEmail": "sarah@example.com",
  "title": "Our Wedding Album"
}
```

**Response 201**: Created design object with empty designData template.

---

### GET /api/public/gallery/:shareToken/smart-album/designs

List client's album designs for this gallery (filtered by clientEmail from session).

**Auth**: Gallery session token

**Response 200**:
```json
{
  "designs": [
    {
      "id": "uuid",
      "title": "Our Wedding Album",
      "status": "DRAFT",
      "productName": "Classic 12x12",
      "updatedAt": "2026-03-31T10:00:00Z"
    }
  ]
}
```

---

### GET /api/public/gallery/:shareToken/smart-album/designs/:designId

Get full design data for the album designer.

**Auth**: Gallery session token

**Response 200**: Full design object including `designData`, selected product, and latest submission status.

---

### PATCH /api/public/gallery/:shareToken/smart-album/designs/:designId

Auto-save design data updates.

**Auth**: Gallery session token

**Body**:
```json
{
  "designData": { "cover": {}, "firstPage": {}, "spreads": [], "lastPage": {} },
  "title": "Our Wedding Album",
  "productId": "uuid"
}
```

**Response 200**: Updated design.

**Validation**: Design must be in DRAFT status. Spread count must not exceed product's `maxPages`.

---

### POST /api/public/gallery/:shareToken/smart-album/designs/:designId/submit

Submit design for photographer review.

**Auth**: Gallery session token

**Response 200** (outside Fotno):
```json
{
  "submission": { "id": "uuid", "status": "PENDING", "version": 1 }
}
```

**Response 200** (inside Fotno -- returns payment intent):
```json
{
  "submission": { "id": "uuid", "status": "PENDING", "version": 1 },
  "payment": {
    "clientSecret": "pi_xxx_secret_xxx",
    "amountCents": 45000,
    "currency": "USD"
  }
}
```

**Validation**: Design must have at least one spread with at least one image. Design must be in DRAFT status.

---

### POST /api/public/gallery/:shareToken/smart-album/designs/:designId/confirm-payment

Confirm payment completion (called after Stripe Payment Element confirms on client side).

**Auth**: Gallery session token

**Body**:
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response 200**: Submission finalized with payment recorded.

---

## Webhook (Billing Routes Extension)

### POST /api/billing/webhook

Extended to handle Stripe Connect events:
- `payment_intent.succeeded` (for album payments via Connect)
- `account.updated` (for Connect onboarding status)

Existing webhook handler pattern (signature verification + event routing) is extended, not replaced.
