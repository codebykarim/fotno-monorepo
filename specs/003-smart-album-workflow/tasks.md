# Tasks: Smart Album Workflow

**Input**: Design documents from `/specs/003-smart-album-workflow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-endpoints.md, quickstart.md

**Tests**: Not requested. Manual testing only (no automated test infrastructure exists).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema, shared types, and route scaffolding

- [x] T001 Add SmartAlbum enums and models (SmartAlbumConfig, SmartAlbumProduct, SmartAlbumDesign, SmartAlbumSubmission, SmartAlbumTransaction) to packages/db/prisma/schema.prisma per data-model.md, including all relations to User and Gallery, indexes, unique constraints, and table mappings
- [x] T002 Run Prisma migration to apply the new schema: `cd packages/db && npx prisma migrate dev --name smart-album-models`
- [x] T003 Create SmartAlbumServices shared module with database reference and helpers in apps/backend/src/services/SmartAlbumServices/_shared.ts (follow pattern from DashboardServices/_shared.ts)
- [x] T004 Create smart album route file scaffold in apps/backend/src/routes/smartAlbumRoutes.ts with empty method mappings and mount it in apps/backend/src/routes/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Layout templates and shared type definitions that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Define layout template data structures and 15-20 predefined templates (spread layouts: full-bleed, 2-image split, 3-image grid, 2+1, 1+2, 4-grid, panoramic strip; single page layouts: cover-full, cover-with-title, centered, centered-with-text) in apps/gallery/lib/layout-templates.ts as exported JSON constants
- [x] T006 [P] Create shared TypeScript types for album feature (SmartAlbumConfig, SmartAlbumProduct, SmartAlbumDesign, DesignData, Slot, SpreadData, SubmissionResponse, etc.) in apps/gallery/lib/album-types.ts
- [x] T007 [P] Create shared TypeScript types for dashboard album feature (config, product, submission list/detail responses) in apps/dashboard/lib/types/smart-album.ts
- [x] T008 [P] Create album API client for gallery app with functions for all public gallery album endpoints (getProducts, getLayouts, createDesign, listDesigns, getDesign, updateDesign, submitDesign, confirmPayment) in apps/gallery/lib/album-service.ts using existing fetch patterns from apps/gallery/lib/backend.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Photographer Configures Album Settings (Priority: P1) MVP

**Goal**: Photographer can enable album creation, configure album products (size, cover, paper, pricing), and select payment method from their dashboard.

**Independent Test**: Log in as photographer, navigate to Smart Albums settings, enable the feature, add album products with sizes/covers/paper/pricing, save, and verify settings persist after refresh.

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement getConfig service that returns photographer's SmartAlbumConfig with associated SmartAlbumProducts (upsert on first access) in apps/backend/src/services/SmartAlbumServices/getConfig.ts
- [x] T010 [P] [US1] Implement upsertConfig service that creates or updates SmartAlbumConfig (enabled, paymentMethod) with validation in apps/backend/src/services/SmartAlbumServices/upsertConfig.ts
- [x] T011 [P] [US1] Implement createProduct service that adds a new SmartAlbumProduct to photographer's config with unique constraint validation in apps/backend/src/services/SmartAlbumServices/createProduct.ts
- [x] T012 [P] [US1] Implement updateProduct service that updates an existing SmartAlbumProduct (partial fields, ownership check) in apps/backend/src/services/SmartAlbumServices/updateProduct.ts
- [x] T013 [P] [US1] Implement deleteProduct service that removes a SmartAlbumProduct (fail if referenced by active designs) in apps/backend/src/services/SmartAlbumServices/deleteProduct.ts
- [x] T014 [US1] Wire config and product endpoints into smartAlbumRoutes.ts: GET /dashboard/smart-album/config, PATCH /dashboard/smart-album/config, POST /dashboard/smart-album/products, PATCH /dashboard/smart-album/products/:productId, DELETE /dashboard/smart-album/products/:productId with isAuth (and isActiveSubscriber for create) in apps/backend/src/routes/smartAlbumRoutes.ts
- [x] T015 [US1] Add Joi validation schemas for config update and product create/update in apps/backend/src/routes/smartAlbumRoutes.ts (inline per existing pattern)
- [x] T016 [P] [US1] Create dashboard API proxy routes for smart album config and products: GET, PATCH at apps/dashboard/app/api/smart-albums/config/route.ts and POST, PATCH, DELETE at apps/dashboard/app/api/smart-albums/products/route.ts and apps/dashboard/app/api/smart-albums/products/[productId]/route.ts
- [x] T017 [P] [US1] Create album config form component (enable/disable toggle, payment method select) in apps/dashboard/components/smart-albums/album-config-form.tsx using @workspace/ui Switch, Select, and Form components
- [x] T018 [P] [US1] Create product form component (add/edit dialog with name, size, coverType, paperType, maxPages, priceCents fields) in apps/dashboard/components/smart-albums/product-form.tsx using @workspace/ui Dialog, Input, Select, and Form components with React Hook Form + Zod
- [x] T019 [P] [US1] Create product list component (table of configured products with edit/delete actions, isActive toggle) in apps/dashboard/components/smart-albums/product-list.tsx using @workspace/ui Table, Button, Badge, and DropdownMenu
- [x] T020 [US1] Create Smart Albums settings page composing config form and product list, with SWR data fetching from /api/smart-albums/config in apps/dashboard/app/smart-albums/page.tsx
- [x] T021 [US1] Add "Smart Albums" navigation item to dashboard sidebar (with Album icon from Lucide) in apps/dashboard/components/dashboard-sidebar.tsx

**Checkpoint**: Photographer can enable albums, add/edit/delete products, and select payment method. Settings persist.

---

## Phase 4: User Story 2 - Client Designs an Album (Priority: P1)

**Goal**: Client sees "Create Album" button in gallery, opens the album designer, selects a product and layout, adds images from the sidebar, resizes/moves/reorders, and previews the album.

**Independent Test**: Open a gallery where albums are enabled, click "Create Album", select a product, choose layouts, add images from the sidebar, resize and move images, reorder pages, and preview the album. Verify auto-save works by refreshing and seeing the design persist.

**Depends on**: US1 (photographer must have configured products)

### Implementation for User Story 2

- [x] T022 [P] [US2] Implement getSmartAlbumProducts service that returns active products for a gallery's photographer (check config enabled, at least one active product) in apps/backend/src/services/PublicGalleryServices/getSmartAlbumProducts.ts
- [x] T023 [P] [US2] Implement getSmartAlbumLayouts service that returns the predefined layout templates (spread + single page) in apps/backend/src/services/PublicGalleryServices/getSmartAlbumLayouts.ts
- [x] T024 [P] [US2] Implement createSmartAlbumDesign service that creates a new SmartAlbumDesign with DRAFT status and empty designData scaffold in apps/backend/src/services/PublicGalleryServices/createSmartAlbumDesign.ts
- [x] T025 [P] [US2] Implement listSmartAlbumDesigns service that returns client's designs for a gallery (filtered by clientEmail) in apps/backend/src/services/PublicGalleryServices/listSmartAlbumDesigns.ts
- [x] T026 [P] [US2] Implement getSmartAlbumDesign service that returns full design data including designData JSONB and selected product info in apps/backend/src/services/PublicGalleryServices/getSmartAlbumDesign.ts
- [x] T027 [P] [US2] Implement updateSmartAlbumDesign service for auto-save (update designData, title, productId; validate DRAFT status and maxPages constraint) in apps/backend/src/services/PublicGalleryServices/updateSmartAlbumDesign.ts
- [x] T028 [US2] Wire client album design endpoints into smartAlbumRoutes with Joi validation schemas per method (especially PATCH designData and POST create): GET /public/gallery/:shareToken/smart-album/products, GET /public/gallery/:shareToken/smart-album/layouts, POST /public/gallery/:shareToken/smart-album/designs, GET /public/gallery/:shareToken/smart-album/designs, GET /public/gallery/:shareToken/smart-album/designs/:designId, PATCH /public/gallery/:shareToken/smart-album/designs/:designId in apps/backend/src/routes/smartAlbumRoutes.ts
- [x] T029 [P] [US2] Create gallery API proxy routes for album endpoints at apps/gallery/app/api/gallery/[shareToken]/smart-album/products/route.ts, layouts/route.ts, designs/route.ts, and designs/[designId]/route.ts
- [x] T030 [US2] Create Zustand store for album designer state (currentDesign, selectedSpread, selectedSlot, undo/redo history, dirty flag, auto-save debounce) in apps/gallery/lib/album-store.ts
- [x] T031 [US2] Create product selector component (cards showing available products with size, cover, paper, price; select to create/change product) in apps/gallery/components/album/product-selector.tsx using @workspace/ui Card, Button, and Badge components
- [x] T032 [US2] Create spread canvas component that renders a spread/page with image slots, handles image placement, resize handles, and drag-to-reposition using percentage-based coordinates in apps/gallery/components/album/spread-canvas.tsx
- [x] T033 [US2] Create image sidebar component that displays gallery photos in a scrollable grid with drag-to-add or click-to-add functionality, fetching images from the existing gallery API in apps/gallery/components/album/image-sidebar.tsx
- [x] T034 [US2] Create layout picker component (grid of layout template thumbnails, click to apply to current spread/page) in apps/gallery/components/album/layout-picker.tsx using @workspace/ui ScrollArea and Button components
- [x] T035 [US2] Create page navigator component (horizontal strip of spread/page thumbnails at bottom, drag-to-reorder, add/remove spread buttons, shows cover/first/last as fixed positions) in apps/gallery/components/album/page-navigator.tsx
- [x] T036 [US2] Create album preview component that renders all pages/spreads in a sequential book-like view (read-only, full-width) in apps/gallery/components/album/album-preview.tsx
- [x] T037 [US2] Create main album designer component composing spread-canvas, image-sidebar, layout-picker, page-navigator, product-selector with toolbar (save status, preview button, submit button) in apps/gallery/components/album/album-designer.tsx using @workspace/ui Button, Tooltip, and Separator for toolbar elements
- [x] T038 [US2] Create album list/create entry page at apps/gallery/app/[shareToken]/album/page.tsx showing existing designs with status badges and "Create New Album" button (fetches products and designs via album-service)
- [x] T039 [US2] Create album designer page at apps/gallery/app/[shareToken]/album/[designId]/page.tsx that loads design data and renders album-designer component
- [x] T040 [US2] Create album preview page at apps/gallery/app/[shareToken]/album/[designId]/preview/page.tsx that renders album-preview component with the design data
- [x] T041 [US2] Add "Create Album" button to gallery page (only visible when photographer has albums enabled and products configured): modify apps/gallery/app/[shareToken]/page.tsx to check for smart album availability and add button linking to /[shareToken]/album
- [x] T042 [US2] Implement auto-save logic in album-store.ts: debounced PATCH call (2-second delay) on designData changes, with save status indicator (saving/saved/error) in the designer toolbar

**Checkpoint**: Client can open a gallery, click "Create Album", select product, design pages with layouts and images, resize/move images, reorder pages, preview, and auto-save. Design persists across sessions.

---

## Phase 5: User Story 3 - Client Submits Album for Review (Priority: P2)

**Goal**: Client submits completed album design to photographer. Client sees submission confirmation and can track status.

**Independent Test**: Complete an album design and click "Submit". Verify the design status changes to SUBMITTED, the client sees a confirmation, and the status is visible when returning to the album list.

**Depends on**: US2 (must have a design to submit)

### Implementation for User Story 3

- [x] T043a [US3] Create centralized album notification service with email templates for all status changes (submitted, approved, changes_requested, rejected) using Resend in apps/backend/src/services/SmartAlbumServices/sendAlbumNotification.ts
- [x] T043 [US3] Implement submitSmartAlbumDesign service that creates a SmartAlbumSubmission with PENDING status, snapshots designData, updates design status to SUBMITTED, and calls sendAlbumNotification to email the photographer in apps/backend/src/services/PublicGalleryServices/submitSmartAlbumDesign.ts
- [x] T044 [US3] Wire submit endpoint: POST /public/gallery/:shareToken/smart-album/designs/:designId/submit in apps/backend/src/routes/smartAlbumRoutes.ts with validation (design must be DRAFT, must have at least one spread with an image)
- [x] T045 [US3] Create gallery API proxy route for submit at apps/gallery/app/api/gallery/[shareToken]/smart-album/designs/[designId]/submit/route.ts
- [x] T046 [US3] Create submit dialog component with confirmation message, album summary (product, page count), and submit button; shows success confirmation after submission in apps/gallery/components/album/submit-dialog.tsx
- [x] T047 [US3] Create status badge component for design status (DRAFT, SUBMITTED, APPROVED, CHANGES_REQUESTED, REJECTED) with appropriate colors in apps/gallery/components/album/status-badge.tsx
- [x] T048 [US3] Update album list page (apps/gallery/app/[shareToken]/album/page.tsx) to show submission status on each design card and photographer notes when status is CHANGES_REQUESTED
- [x] T049 [US3] Update album designer (apps/gallery/components/album/album-designer.tsx) to lock editing when design status is SUBMITTED or APPROVED, show photographer notes when CHANGES_REQUESTED, and allow re-editing when CHANGES_REQUESTED (status returns to DRAFT)

**Checkpoint**: Client can submit an album, sees confirmation, and can track status. Photographer receives email notification. Design is locked during review.

---

## Phase 6: User Story 4 - Photographer Reviews and Manages Album Submissions (Priority: P2)

**Goal**: Photographer views incoming submissions, reviews album designs in detail, and can approve, request changes, or reject. Photographer can export approved albums as print-ready images.

**Independent Test**: Log in as photographer, see submitted album in submissions list, open it, review the design, approve/request changes/reject, and verify client sees updated status. For approved albums, click "Download Export" and verify the ZIP downloads.

**Depends on**: US3 (must have submissions to review)

### Implementation for User Story 4

- [x] T050 [P] [US4] Implement getSubmissions service that lists submissions across photographer's galleries with filtering (status, galleryId) and pagination in apps/backend/src/services/SmartAlbumServices/getSubmissions.ts
- [x] T051 [P] [US4] Implement getSubmissionDetail service that returns full submission with designSnapshot, product info, client info, and transaction status in apps/backend/src/services/SmartAlbumServices/getSubmissionDetail.ts
- [x] T052 [P] [US4] Implement reviewSubmission service that handles approve (set APPROVED), request_changes (set CHANGES_REQUESTED, include notes, unlock design to DRAFT), and reject (set REJECTED, include reason) actions using Prisma transactions, delegating all client notifications to sendAlbumNotification (from T043a) in apps/backend/src/services/SmartAlbumServices/reviewSubmission.ts
- [x] T053 [P] [US4] Implement generateExport service that renders high-res spread/page images using Sharp (composite original photos at percentage-based positions onto a sized canvas), zips them, uploads to S3, and returns a signed download URL in apps/backend/src/services/SmartAlbumServices/generateExport.ts
- [x] T054 [US4] Wire submission endpoints: GET /dashboard/smart-album/submissions, GET /dashboard/smart-album/submissions/:submissionId, POST /dashboard/smart-album/submissions/:submissionId/review, POST /dashboard/smart-album/submissions/:submissionId/export in apps/backend/src/routes/smartAlbumRoutes.ts with isAuth and Joi validation
- [x] T055 [P] [US4] Create dashboard API proxy routes for submissions: GET at apps/dashboard/app/api/smart-albums/submissions/route.ts, GET and POST review/export at apps/dashboard/app/api/smart-albums/submissions/[submissionId]/route.ts, apps/dashboard/app/api/smart-albums/submissions/[submissionId]/review/route.ts, apps/dashboard/app/api/smart-albums/submissions/[submissionId]/export/route.ts
- [x] T056 [P] [US4] Create submission list component (table with client name, gallery, product, date, status badge, click to review) in apps/dashboard/components/smart-albums/submission-list.tsx using @workspace/ui Table and Badge
- [x] T057 [P] [US4] Create album preview viewer component (read-only renderer of designSnapshot, showing all spreads and pages with images at correct positions) in apps/dashboard/components/smart-albums/album-preview-viewer.tsx
- [x] T058 [US4] Create submission review component composing album-preview-viewer with action buttons (Approve, Request Changes with notes textarea, Reject with reason textarea) and export download button (for approved) in apps/dashboard/components/smart-albums/submission-review.tsx
- [x] T059 [US4] Create submissions page at apps/dashboard/app/smart-albums/submissions/page.tsx with submission list, filters (status, gallery), and click-through to review view

**Checkpoint**: Full review workflow operational. Photographer can list, review, approve/reject/request changes, and download print-ready exports.

---

## Phase 7: User Story 5 - In-Platform Payment and Photographer Withdrawal (Priority: P3)

**Goal**: When photographer chooses "inside Fotno" payment, client pays during submission via Stripe. Fotno deducts transaction fee. Photographer can view earnings via Stripe Connect dashboard.

**Independent Test**: Set photographer payment method to INSIDE_FOTNO, complete Stripe Connect onboarding, have client submit an album, verify payment prompt appears, complete payment, verify transaction is recorded, and photographer can view Connect dashboard for earnings.

**Depends on**: US3 (payment occurs during submission flow)

### Implementation for User Story 5

- [x] T060 [P] [US5] Implement stripeConnectOnboard service that creates a Stripe Connect Express account (or retrieves existing) and generates an onboarding link in apps/backend/src/services/SmartAlbumServices/stripeConnectOnboard.ts
- [x] T061 [P] [US5] Implement stripeConnectStatus service that checks Connect account charges_enabled and payouts_enabled status in apps/backend/src/services/SmartAlbumServices/stripeConnectStatus.ts
- [x] T062 [P] [US5] Implement confirmSmartAlbumPayment service that verifies Stripe PaymentIntent succeeded, creates SmartAlbumTransaction record (amount, fee, net), and finalizes submission in apps/backend/src/services/PublicGalleryServices/confirmSmartAlbumPayment.ts
- [x] T063 [US5] Update submitSmartAlbumDesign service (apps/backend/src/services/PublicGalleryServices/submitSmartAlbumDesign.ts) to create a Stripe PaymentIntent with transfer_data to photographer's Connect account when paymentMethod is INSIDE_FOTNO, returning clientSecret for the frontend
- [x] T064 [US5] Wire payment and connect endpoints: POST /dashboard/smart-album/connect/onboard, GET /dashboard/smart-album/connect/status, POST /public/gallery/:shareToken/smart-album/designs/:designId/confirm-payment in apps/backend/src/routes/smartAlbumRoutes.ts
- [x] T065 [US5] Extend Stripe webhook handler to process Connect events (payment_intent.succeeded for album payments, account.updated for Connect onboarding status) in apps/backend/src/services/SubscriptionServices/handleWebhook.ts
- [x] T066 [P] [US5] Create dashboard API proxy routes for Connect: POST at apps/dashboard/app/api/smart-albums/connect/onboard/route.ts, GET at apps/dashboard/app/api/smart-albums/connect/status/route.ts
- [x] T067 [P] [US5] Create Stripe Connect setup component (onboarding button, status indicator for charges/payouts enabled, link to Stripe Connect dashboard for earnings) in apps/dashboard/components/smart-albums/stripe-connect-setup.tsx
- [x] T068 [US5] Integrate Stripe Connect setup into album config form: show Connect onboarding when paymentMethod is INSIDE_FOTNO, block enabling INSIDE_FOTNO until onboarding is complete in apps/dashboard/components/smart-albums/album-config-form.tsx
- [x] T069 [US5] Create gallery API proxy route for payment confirmation at apps/gallery/app/api/gallery/[shareToken]/smart-album/designs/[designId]/confirm-payment/route.ts
- [x] T070 [US5] Update submit dialog (apps/gallery/components/album/submit-dialog.tsx) to integrate Stripe Payment Element when photographer uses INSIDE_FOTNO: show payment form after clicking Submit, call confirm-payment endpoint after Stripe confirms, then finalize submission. Handle payment_intent.payment_failed gracefully (show retry option). Add @stripe/stripe-js and @stripe/react-stripe-js to apps/gallery/package.json

**Checkpoint**: Full payment flow operational. Photographer can onboard to Stripe Connect. Client pays during submission. Transaction recorded. Photographer views earnings in Stripe dashboard.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, notifications, and refinements across all stories

- [x] T071 [P] Handle edge case: photographer disables albums while client has in-progress design — show notification on album designer if config.enabled becomes false, disable submit button in apps/gallery/components/album/album-designer.tsx
- [x] T072 [P] Handle edge case: photographer removes a product while client has in-progress design using it — show warning to select a different product before submitting in apps/gallery/components/album/product-selector.tsx
- [x] T073 [P] Handle edge case: client tries to create album with empty gallery (no photos) — show empty state message on album entry page in apps/gallery/app/[shareToken]/album/page.tsx
- [x] T074 [P] Handle edge case: max page enforcement — prevent adding spreads beyond product's maxPages limit with user-friendly message in apps/gallery/components/album/page-navigator.tsx
- [x] T076 Add new environment variables (STRIPE_CONNECT_CLIENT_ID, SMART_ALBUM_PLATFORM_FEE_PERCENT, SMART_ALBUM_EXPORT_BUCKET) to docker-compose.yml and document in quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (Prisma schema must exist)
- **US1 (Phase 3)**: Depends on Phase 2 — first user story to implement
- **US2 (Phase 4)**: Depends on US1 (needs configured products)
- **US3 (Phase 5)**: Depends on US2 (needs a design to submit)
- **US4 (Phase 6)**: Depends on US3 (needs submissions to review)
- **US5 (Phase 7)**: Depends on US3 (payment occurs during submission)
- **Polish (Phase 8)**: Can start after US3 is complete; some tasks can parallel with US4/US5

### User Story Dependencies

- **US1 (P1)**: After Foundational — no other story dependencies
- **US2 (P1)**: After US1 — needs album products to exist
- **US3 (P2)**: After US2 — needs a completed design
- **US4 (P2)**: After US3 — needs submitted designs to review. **Can parallel with US5.**
- **US5 (P3)**: After US3 — adds payment to submission flow. **Can parallel with US4.**

### Within Each User Story

- Backend services (parallelizable) before route wiring
- Route wiring before API proxy routes
- API proxy routes before/parallel with UI components
- UI components before page composition

### Parallel Opportunities

**Phase 2**: T005, T006, T007, T008 all in parallel (different files, no dependencies)

**US1 Backend**: T009, T010, T011, T012, T013 all in parallel (separate service files)
**US1 Dashboard UI**: T016, T017, T018, T019 all in parallel (after routes wired)

**US2 Backend**: T022, T023, T024, T025, T026, T027 all in parallel (separate service files)
**US2 Gallery UI**: T031, T032, T033, T034, T035, T036 all in parallel (separate components)

**US4 Backend**: T050, T051, T052, T053 all in parallel (separate service files)
**US4 Dashboard UI**: T055, T056, T057 all in parallel (after routes wired)

**US5**: T060, T061, T062 in parallel (separate services); T066, T067 in parallel (separate files)

**US4 and US5**: Can be worked on in parallel by different developers after US3 is complete

---

## Parallel Example: User Story 1

```bash
# Launch all backend services in parallel:
Task: T009 "getConfig service in SmartAlbumServices/getConfig.ts"
Task: T010 "upsertConfig service in SmartAlbumServices/upsertConfig.ts"
Task: T011 "createProduct service in SmartAlbumServices/createProduct.ts"
Task: T012 "updateProduct service in SmartAlbumServices/updateProduct.ts"
Task: T013 "deleteProduct service in SmartAlbumServices/deleteProduct.ts"

# Then wire routes (depends on services):
Task: T014 "Wire endpoints in smartAlbumRoutes.ts"
Task: T015 "Add Joi validation schemas"

# Then launch UI components in parallel:
Task: T016 "Dashboard API proxy routes"
Task: T017 "Album config form component"
Task: T018 "Product form component"
Task: T019 "Product list component"

# Then compose the page:
Task: T020 "Smart Albums settings page"
Task: T021 "Add sidebar nav item"
```

---

## Parallel Example: User Story 2

```bash
# Launch all backend services in parallel:
Task: T022 "getSmartAlbumProducts service"
Task: T023 "getSmartAlbumLayouts service"
Task: T024 "createSmartAlbumDesign service"
Task: T025 "listSmartAlbumDesigns service"
Task: T026 "getSmartAlbumDesign service"
Task: T027 "updateSmartAlbumDesign service"

# Then wire routes + proxy routes:
Task: T028 "Wire client album design endpoints"
Task: T029 "Gallery API proxy routes"

# Then launch designer components in parallel:
Task: T030 "Zustand store for designer state"
Task: T031 "Product selector component"
Task: T032 "Spread canvas component"
Task: T033 "Image sidebar component"
Task: T034 "Layout picker component"
Task: T035 "Page navigator component"
Task: T036 "Album preview component"

# Then compose pages (depends on components + store):
Task: T037 "Main album designer component"
Task: T038 "Album list/create entry page"
Task: T039 "Album designer page"
Task: T040 "Album preview page"
Task: T041 "Add 'Create Album' button to gallery page"
Task: T042 "Auto-save logic"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T008)
3. Complete Phase 3: US1 - Photographer Settings (T009-T021)
4. **STOP and VALIDATE**: Photographer can configure album products
5. Deploy if ready — settings are useful even before client designer exists

### Incremental Delivery

1. Setup + Foundational → Schema and infrastructure ready
2. US1 → Photographer can configure albums → Deploy (settings page live)
3. US2 → Client can design albums → Deploy (designer live, no submit yet)
4. US3 → Client can submit → Deploy (submission flow live)
5. US4 → Photographer can review + export → Deploy (full workflow without payments)
6. US5 → Payment flow → Deploy (complete feature with payments)
7. Each increment adds value without breaking previous stories

### Critical Path

Setup → Foundational → US1 → US2 → US3 → US4 (or US5 in parallel)

**Total time-critical chain**: T001 → T002 → T005-T008 → T009-T021 → T022-T042 → T043-T049 → T050-T059 (+ T060-T070 in parallel)

---

## Notes

- [P] tasks = different files, no dependencies within the parallel group
- [Story] label maps task to specific user story for traceability
- US4 and US5 can proceed in parallel after US3 is complete
- No automated tests — validate each checkpoint manually
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- SmartAlbum prefix on all new entities to avoid collision with existing Album model
