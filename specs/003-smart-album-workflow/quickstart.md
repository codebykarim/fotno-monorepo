# Quickstart: Smart Album Workflow

**Branch**: `003-smart-album-workflow` | **Date**: 2026-03-31

## What This Feature Does

Adds a SmartAlbums-like album design workflow to Fotno. Clients design physical photo albums from gallery images, submit for photographer review, and optionally pay through the platform. Photographers configure products, review submissions, and export print-ready files.

## Key Files to Create/Modify

### New Files (Backend)

```
apps/backend/src/routes/smartAlbumRoutes.ts          # Route definitions
apps/backend/src/services/SmartAlbumServices/
  ├── _shared.ts                                      # DB reference, helpers
  ├── getConfig.ts                                    # Get photographer config
  ├── upsertConfig.ts                                 # Create/update config
  ├── createProduct.ts                                # Add album product
  ├── updateProduct.ts                                # Edit product
  ├── deleteProduct.ts                                # Remove product
  ├── getSubmissions.ts                               # List submissions
  ├── getSubmissionDetail.ts                           # Full submission view
  ├── reviewSubmission.ts                             # Approve/reject/request changes
  ├── generateExport.ts                               # Render print-ready spreads
  ├── stripeConnectOnboard.ts                         # Create Connect onboarding
  └── stripeConnectStatus.ts                          # Check Connect status
apps/backend/src/services/PublicGalleryServices/
  ├── getSmartAlbumProducts.ts                        # Products for gallery
  ├── getSmartAlbumLayouts.ts                         # Layout templates
  ├── createSmartAlbumDesign.ts                       # New design
  ├── listSmartAlbumDesigns.ts                        # Client's designs
  ├── getSmartAlbumDesign.ts                          # Full design data
  ├── updateSmartAlbumDesign.ts                       # Auto-save
  ├── submitSmartAlbumDesign.ts                       # Submit for review
  └── confirmSmartAlbumPayment.ts                     # Payment confirmation
```

### New Files (Gallery App - Album Designer)

```
apps/gallery/app/[shareToken]/album/
  ├── page.tsx                                        # Album list / create entry
  └── [designId]/
      ├── page.tsx                                    # Album designer page
      └── preview/page.tsx                            # Preview mode
apps/gallery/components/album/
  ├── album-designer.tsx                              # Main designer component
  ├── spread-canvas.tsx                               # Spread/page renderer
  ├── image-sidebar.tsx                               # Gallery image picker
  ├── layout-picker.tsx                               # Layout template selector
  ├── page-navigator.tsx                              # Page thumbnails + reorder
  ├── product-selector.tsx                            # Album product options
  ├── album-preview.tsx                               # Preview renderer
  ├── submit-dialog.tsx                               # Submission + payment flow
  └── status-badge.tsx                                # Design status indicator
apps/gallery/lib/
  ├── album-service.ts                                # API client for album endpoints
  ├── album-types.ts                                  # TypeScript types
  ├── album-store.ts                                  # Zustand store for designer state
  └── layout-templates.ts                             # Layout definitions
```

### New Files (Dashboard App - Photographer Settings)

```
apps/dashboard/app/smart-albums/
  ├── page.tsx                                        # Album settings + product management
  └── submissions/page.tsx                            # Submission review list
apps/dashboard/components/smart-albums/
  ├── album-config-form.tsx                           # Enable/disable + payment method
  ├── product-form.tsx                                # Add/edit product
  ├── product-list.tsx                                # Product catalog table
  ├── submission-list.tsx                             # Submissions table
  ├── submission-review.tsx                           # Review a single submission
  ├── stripe-connect-setup.tsx                        # Connect onboarding UI
  └── album-preview-viewer.tsx                        # Read-only design viewer
```

### Modified Files

```
packages/db/prisma/schema.prisma                     # New models + enums
apps/backend/src/routes/index.ts                      # Mount smartAlbumRoutes
apps/backend/src/services/SubscriptionServices/handleWebhook.ts  # Connect events
apps/gallery/app/[shareToken]/page.tsx                # Add "Create Album" button
apps/gallery/components/gallery/gallery-page-client.tsx  # Album button in gallery UI
apps/dashboard/components/dashboard-sidebar.tsx        # Add "Smart Albums" nav item
```

## Development Order

1. **Database**: Add Prisma models, run migration
2. **Backend services**: Config CRUD → Product CRUD → Design CRUD → Submission workflow
3. **Dashboard UI**: Settings page → Product management → Submission review
4. **Gallery UI**: Product selector → Designer canvas → Auto-save → Preview → Submit
5. **Payments**: Stripe Connect onboarding → Payment flow → Webhook handling
6. **Export**: Server-side spread rendering with Sharp

## Environment Variables (New)

Add these to `.env` (local) and `docker-compose.yml` (production) under the `backend` service:

```
STRIPE_CONNECT_CLIENT_ID=          # Stripe Connect platform client ID (from Stripe Dashboard → Connect settings)
SMART_ALBUM_PLATFORM_FEE_PERCENT=5 # Platform fee percentage taken from album payments (integer, e.g. 5 = 5%)
SMART_ALBUM_EXPORT_BUCKET=         # S3 bucket for storing print-ready export ZIPs (can reuse AWS_S3_BUCKET)
```

### Where to find these values

- **STRIPE_CONNECT_CLIENT_ID**: Stripe Dashboard → Connect → Settings → `ca_...` client ID
- **SMART_ALBUM_PLATFORM_FEE_PERCENT**: Your chosen platform take-rate as a whole number percentage
- **SMART_ALBUM_EXPORT_BUCKET**: Same bucket as `AWS_S3_BUCKET` is fine; exports are stored under a `smart-album-exports/` prefix

## Running Locally

No new services needed. The feature adds routes to the existing backend and pages to the existing gallery/dashboard apps.

```bash
# After adding Prisma models:
cd packages/db && npx prisma migrate dev --name smart-album-models

# Start as usual:
docker-compose up
```
