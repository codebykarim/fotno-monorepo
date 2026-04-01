# Data Model: Smart Album Workflow

**Branch**: `003-smart-album-workflow` | **Date**: 2026-03-31

## Entity Relationship Overview

```
User (photographer)
 └─ SmartAlbumConfig (1:1)
     └─ SmartAlbumProduct (1:N)

Gallery
 └─ SmartAlbumDesign (1:N, via client)
     ├─ SmartAlbumProduct (selected product)
     ├─ designData (JSONB: pages, spreads, image placements)
     └─ SmartAlbumSubmission (1:N, one per submit/resubmit cycle)
          └─ SmartAlbumTransaction (0:1, for "inside Fotno" payments)
```

## Entities

### SmartAlbumConfig

Photographer-level toggle and payment preference for the album feature.

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PK, unique | |
| userId | UUID | FK → User, unique | One config per photographer |
| enabled | Boolean | default: false | Feature toggle |
| paymentMethod | Enum | OUTSIDE_FOTNO, INSIDE_FOTNO | How clients pay |
| stripeConnectAccountId | String? | nullable | Required for INSIDE_FOTNO |
| stripeConnectOnboarded | Boolean | default: false | Connect onboarding complete |
| createdAt | DateTime | default: now() | |
| updatedAt | DateTime | auto-update | |

**Map**: `smart_album_config`
**Index**: `userId` (unique)

---

### SmartAlbumProduct

A specific album offering with fixed pricing per size+cover+paper combination.

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PK, unique | |
| configId | UUID | FK → SmartAlbumConfig | Owner config |
| name | String | | Display name (e.g., "Classic 12x12") |
| size | String | | Album dimensions (e.g., "12x12", "10x10") |
| coverType | String | | Cover material (e.g., "leather", "linen") |
| paperType | String | | Paper finish (e.g., "matte", "lustre") |
| maxPages | Int | min: 2 | Maximum spread count (interior spreads) |
| priceCents | Int | min: 0 | Price in cents (USD) |
| currency | String | default: "USD" | ISO currency code |
| isActive | Boolean | default: true | Soft-disable without deleting |
| createdAt | DateTime | default: now() | |
| updatedAt | DateTime | auto-update | |

**Map**: `smart_album_product`
**Index**: `configId`
**Unique**: `[configId, size, coverType, paperType]` (one price per combination)

---

### SmartAlbumDesign

A client's album design, containing all layout and image placement data.

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PK, unique | |
| galleryId | UUID | FK → Gallery | Source gallery for images |
| productId | UUID | FK → SmartAlbumProduct | Selected album product |
| clientName | String | | Client display name |
| clientEmail | String | | Client email for notifications |
| title | String | default: "Untitled Album" | Album title |
| designData | JSONB | | Full layout state (see schema below) |
| status | Enum | DRAFT, SUBMITTED, APPROVED, CHANGES_REQUESTED, REJECTED | Current state |
| createdAt | DateTime | default: now() | |
| updatedAt | DateTime | auto-update | |

**Map**: `smart_album_design`
**Index**: `[galleryId, status]`
**Index**: `[galleryId, clientEmail]`

#### designData JSONB Schema

```jsonc
{
  "cover": {
    "layoutId": "cover-full-bleed",
    "slots": [
      {
        "photoId": "uuid",
        "x": 0, "y": 0,        // position (percentage of page)
        "width": 100, "height": 100,  // size (percentage)
        "cropX": 0, "cropY": 0,      // crop offset (percentage of image)
        "cropWidth": 100, "cropHeight": 100,  // crop area (percentage)
        "rotation": 0
      }
    ]
  },
  "firstPage": {
    "layoutId": "single-centered",
    "slots": [/* same slot structure */]
  },
  "spreads": [
    {
      "order": 0,
      "layoutId": "two-image-horizontal",
      "slots": [/* slot array */]
    }
  ],
  "lastPage": {
    "layoutId": "single-centered",
    "slots": [/* same slot structure */]
  }
}
```

**Slot coordinates use percentages** (0-100) for resolution independence. The designer renders at preview resolution; export renders at full resolution using the same percentage-based coordinates.

---

### SmartAlbumSubmission

A submission record created each time a client submits (or resubmits) their design.

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PK, unique | |
| designId | UUID | FK → SmartAlbumDesign | The design being submitted |
| version | Int | default: 1 | Increments on resubmission |
| designSnapshot | JSONB | | Frozen copy of designData at submission time |
| status | Enum | PENDING, APPROVED, CHANGES_REQUESTED, REJECTED | Review status |
| photographerNotes | String? | nullable | Feedback when requesting changes or rejecting |
| reviewedAt | DateTime? | nullable | When photographer took action |
| submittedAt | DateTime | default: now() | |
| exportReady | Boolean | default: false | Whether export has been generated |
| exportUrl | String? | nullable | S3 key for the export ZIP |

**Map**: `smart_album_submission`
**Index**: `[designId, version]` (unique)
**Index**: `[designId, status]`

---

### SmartAlbumTransaction

Payment record for "inside Fotno" payments.

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PK, unique | |
| submissionId | UUID | FK → SmartAlbumSubmission, unique | One payment per submission |
| stripePaymentIntentId | String | unique | Stripe PI reference |
| amountCents | Int | | Total charged to client |
| feeCents | Int | | Fotno platform fee |
| netCents | Int | | Amount credited to photographer |
| currency | String | default: "USD" | |
| status | Enum | PENDING, SUCCEEDED, FAILED, REFUNDED | Payment state |
| paidAt | DateTime? | nullable | When payment succeeded |
| createdAt | DateTime | default: now() | |

**Map**: `smart_album_transaction`
**Index**: `submissionId` (unique)

---

## State Transitions

### SmartAlbumDesign.status

```
DRAFT → SUBMITTED → APPROVED
                  → CHANGES_REQUESTED → DRAFT (client edits) → SUBMITTED
                  → REJECTED
```

- `DRAFT`: Client is designing or revising after change request.
- `SUBMITTED`: Client has submitted (and paid, if applicable). Design is locked for review.
- `APPROVED`: Photographer approved. Export can be generated.
- `CHANGES_REQUESTED`: Photographer sent feedback. Design unlocks for client editing, status returns to DRAFT.
- `REJECTED`: Terminal state. Client is notified with reason.

### SmartAlbumSubmission.status

```
PENDING → APPROVED
       → CHANGES_REQUESTED
       → REJECTED
```

Each submission is immutable after review. A resubmission creates a new `SmartAlbumSubmission` with incremented `version`.

### SmartAlbumTransaction.status

```
PENDING → SUCCEEDED
       → FAILED
```

Mirrors Stripe Payment Intent lifecycle.

## Enums

```
SmartAlbumPaymentMethod: OUTSIDE_FOTNO | INSIDE_FOTNO
SmartAlbumDesignStatus: DRAFT | SUBMITTED | APPROVED | CHANGES_REQUESTED | REJECTED
SmartAlbumSubmissionStatus: PENDING | APPROVED | CHANGES_REQUESTED | REJECTED
SmartAlbumTransactionStatus: PENDING | SUCCEEDED | FAILED | REFUNDED
```

## Relationships to Existing Models

- `SmartAlbumConfig.userId` → `User.id` (photographer)
- `SmartAlbumDesign.galleryId` → `Gallery.id` (source gallery)
- `SmartAlbumDesign.productId` → `SmartAlbumProduct.id` (selected product)
- Photos are referenced by ID within `designData` JSONB, not via a junction table. This avoids schema changes to the Photo model and allows flexible slot composition.

## Notes

- No changes to existing `Album` or `AlbumPhoto` models. The `SmartAlbum*` entities are entirely new.
- `designData` JSONB provides schema flexibility for layout evolution without migrations.
- `designSnapshot` on submission freezes the design state, ensuring the photographer reviews exactly what the client submitted even if the client later edits (for a future resubmission).
- Photographer balance/withdrawal will leverage Stripe Connect's built-in payout and balance tracking rather than custom balance tables, reducing complexity and compliance burden.
