# Feature Specification: Smart Album Workflow

**Feature Branch**: `003-smart-album-workflow`
**Created**: 2026-03-31
**Status**: Draft
**Input**: User description: "Client-facing album design tool integrated into gallery, with photographer-controlled settings, review workflow, and optional in-platform payments."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Photographer Configures Album Settings (Priority: P1)

A photographer navigates to their settings and enables album creation for their clients. They configure the album products they offer: album sizes (e.g., 8x8, 10x10, 12x12), cover types (e.g., leather, linen, photo cover), paper types (e.g., matte, glossy, lustre), maximum page counts, and pricing for each combination. They also choose their preferred payment option: either "outside Fotno" (photographer handles payment directly) or "inside Fotno" (client pays through the platform with a transaction fee).

**Why this priority**: Without photographer settings, clients have no album options to choose from. This is the foundational configuration that gates all other functionality.

**Independent Test**: Can be fully tested by having a photographer log in, enable album creation, add album products with sizes/covers/paper/pricing, save, and verify the settings persist. Delivers value by letting photographers define their album catalog.

**Acceptance Scenarios**:

1. **Given** a photographer is on their settings page, **When** they toggle the album creation feature on, **Then** album configuration options become visible and editable.
2. **Given** album creation is enabled, **When** the photographer adds an album product with size, cover type, paper type, max pages, and price, **Then** the product is saved and appears in their album catalog.
3. **Given** an album catalog exists, **When** the photographer edits or removes a product, **Then** the changes are reflected immediately.
4. **Given** album creation is enabled, **When** the photographer selects a payment option (outside Fotno or inside Fotno), **Then** the selection is saved and determines how clients will pay.
5. **Given** a photographer has not enabled album creation, **When** a client views that photographer's gallery, **Then** no "Create Album" option is visible.

---

### User Story 2 - Client Designs an Album (Priority: P1)

A client opens a gallery shared by their photographer and sees a "Create Album" button (only if the photographer has enabled albums). Clicking it takes them to the album designer page. The client selects a layout template, then browses the gallery images in a sidebar and drags/adds them onto album pages. The client can resize images, move them within the page, change the page layout, and reorder pages. The client can preview a realistic representation of their album at any time before submitting.

**Why this priority**: This is the core value proposition -- the album design experience that replaces standalone album software. Without this, there is no product.

**Independent Test**: Can be fully tested by opening a gallery with albums enabled, clicking "Create Album", selecting a layout, adding images from the sidebar, manipulating images (resize, move), changing layouts, reordering pages, and previewing the result. Delivers value by letting clients design albums visually.

**Acceptance Scenarios**:

1. **Given** a client is viewing a gallery where albums are enabled, **When** they click "Create Album", **Then** they are redirected to the album designer page.
2. **Given** the album designer is open, **When** the client selects a layout template, **Then** the page structure updates to match the chosen layout.
3. **Given** a layout is selected, **When** the client browses the gallery sidebar and adds an image to a page slot, **Then** the image appears in the designated slot.
4. **Given** an image is placed on a page, **When** the client resizes or moves it, **Then** the image updates its size/position in real time.
5. **Given** multiple pages exist, **When** the client drags a page to a new position, **Then** the page order updates accordingly.
6. **Given** the client has designed pages, **When** they click "Preview", **Then** a realistic preview of the album is displayed showing all pages in sequence.
7. **Given** the album designer is open, **When** the client selects album options (size, cover type, paper type), **Then** only options the photographer has configured are available for selection.

---

### User Story 3 - Client Submits Album for Review (Priority: P2)

After finishing the album design, the client submits it to the photographer for review. If the photographer uses "inside Fotno" payments, the client completes payment during submission. If "outside Fotno" is configured, the client simply submits the design without payment. The client receives confirmation that their album has been submitted.

**Why this priority**: Submission connects the client's design work to the photographer's review workflow. Without it, album designs have no purpose.

**Independent Test**: Can be fully tested by completing an album design and clicking "Submit", verifying the submission is recorded and the client sees a confirmation. For in-platform payment, verify payment flow completes before submission finalizes.

**Acceptance Scenarios**:

1. **Given** a client has completed an album design, **When** they click "Submit", **Then** the album is sent to the photographer for review and the client sees a confirmation message.
2. **Given** the photographer uses "inside Fotno" payment, **When** the client submits, **Then** the client is prompted to complete payment before the submission is finalized.
3. **Given** the photographer uses "outside Fotno" payment, **When** the client submits, **Then** the album is submitted without a payment step.
4. **Given** a client has submitted an album, **When** they return to the gallery, **Then** they can see the status of their submitted album (e.g., pending review, approved, changes requested, rejected).

---

### User Story 4 - Photographer Reviews and Manages Album Submissions (Priority: P2)

The photographer sees incoming album submissions in their dashboard. They can open a submitted album to review the client's design in detail. The photographer can approve the album (moving it to production), request changes (sending feedback to the client with specific notes), or reject the album (with a reason). If changes are requested, the client can revise and resubmit.

**Why this priority**: The review workflow ensures quality control and gives photographers authority over the final product. It closes the loop on the album creation process.

**Independent Test**: Can be fully tested by having a photographer view a submitted album, approve it, request changes, or reject it, and verifying the client sees the updated status and any feedback.

**Acceptance Scenarios**:

1. **Given** a client has submitted an album, **When** the photographer opens their album submissions view, **Then** the submission appears with client name, gallery name, submission date, and status.
2. **Given** the photographer is reviewing a submitted album, **When** they click "Approve", **Then** the album status changes to approved and the client is notified.
3. **Given** the photographer is reviewing a submitted album, **When** they click "Request Changes" and add notes, **Then** the album status changes to "changes requested" and the client receives the feedback.
4. **Given** a client's album has status "changes requested", **When** the client opens the album, **Then** they can see the photographer's notes and edit the design accordingly.
5. **Given** a client has revised their album, **When** they resubmit, **Then** the photographer sees the updated submission for re-review.
6. **Given** the photographer is reviewing a submitted album, **When** they click "Reject" and provide a reason, **Then** the album status changes to rejected and the client is notified with the reason.
7. **Given** an album has been approved, **When** the photographer clicks "Download Export", **Then** a package of high-resolution spread/page images (JPEG/PNG) is downloaded, ready for print lab upload.

---

### User Story 5 - In-Platform Payment and Photographer Withdrawal (Priority: P3)

When a photographer has chosen "inside Fotno" payment, the client pays the photographer's album price during submission. Fotno deducts a small transaction fee and the remaining balance becomes available in the photographer's account for withdrawal. The photographer can view their earnings and withdraw funds.

**Why this priority**: In-platform payment is one of two payment options and adds significant value, but the album workflow functions without it (using the "outside Fotno" option).

**Independent Test**: Can be fully tested by having a client pay for an album during submission, verifying the transaction fee is deducted, the photographer's balance is credited, and the photographer can initiate a withdrawal.

**Acceptance Scenarios**:

1. **Given** a photographer has "inside Fotno" payment enabled, **When** a client submits an album and pays, **Then** the payment is processed and the photographer's balance is credited minus the transaction fee.
2. **Given** a photographer has earned album revenue, **When** they view their earnings dashboard, **Then** they see a breakdown of total earnings, fees deducted, and available balance.
3. **Given** a photographer has available balance, **When** they request a withdrawal, **Then** the withdrawal is initiated and the photographer is notified of the expected timeline.

---

### Edge Cases

- What happens when a client starts designing an album but the photographer disables album creation before submission? The client should be notified that album creation is no longer available for this gallery and their in-progress design should be saved but not submittable.
- What happens when a photographer changes their album product options (e.g., removes a size) while a client has an in-progress design using that option? The client should be notified to update their selection to a currently available option before they can submit.
- What happens when a client's payment fails during "inside Fotno" submission? The submission should not be finalized and the client should be prompted to retry payment or contact their photographer.
- What happens when a photographer has no album products configured but album creation is enabled? The "Create Album" button should not appear to clients until at least one album product is fully configured.
- What happens when a client tries to create an album with a gallery that has no images? The album designer should display a message indicating that images are needed before an album can be created.
- What happens when a client exceeds the maximum page count set by the photographer? The system should prevent adding pages beyond the configured maximum and inform the client of the limit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow photographers to enable or disable album creation for their clients from their settings.
- **FR-002**: System MUST allow photographers to configure album products including album sizes, cover types, paper types, maximum page counts, and pricing.
- **FR-003**: System MUST allow photographers to choose between two payment options: "outside Fotno" (photographer handles payment directly) or "inside Fotno" (client pays through platform).
- **FR-004**: System MUST display a "Create Album" button on gallery pages only when the photographer has enabled album creation and has at least one configured album product.
- **FR-005**: System MUST provide an album designer interface where clients can select layout templates for spreads (interior facing pages) and individual pages (cover, first, last).
- **FR-006**: System MUST display gallery images in a sidebar within the album designer, allowing clients to add them to page slots.
- **FR-007**: System MUST allow clients to resize, move, and reposition images within album pages.
- **FR-008**: System MUST allow clients to change the layout of spreads and individual pages (cover, first, last).
- **FR-009**: System MUST allow clients to reorder pages by dragging them to new positions.
- **FR-010**: System MUST provide a preview mode showing a realistic representation of the album before submission.
- **FR-011**: System MUST only show album options (sizes, covers, paper types) that the photographer has configured -- clients must not see options the photographer does not offer.
- **FR-012**: System MUST allow clients to submit a completed album design to the photographer for review.
- **FR-013**: System MUST require payment completion before submission when the photographer uses "inside Fotno" payment.
- **FR-014**: System MUST allow photographers to view, approve, request changes on, or reject submitted albums. Photographers cannot directly edit the client's design; they can only request changes with notes for the client to action.
- **FR-015**: System MUST allow photographers to include notes/feedback when requesting changes on a submitted album.
- **FR-016**: System MUST allow clients to revise and resubmit albums after receiving change requests.
- **FR-017**: System MUST notify clients when their album status changes (approved, changes requested, rejected).
- **FR-018**: System MUST notify photographers when a new album submission or resubmission is received.
- **FR-019**: System MUST deduct a transaction fee from "inside Fotno" payments and credit the remaining balance to the photographer's account.
- **FR-020**: System MUST allow photographers to view their album earnings and available balance via the Stripe Connect dashboard (accessed through a link in Fotno).
- **FR-021**: System MUST allow photographers to receive payouts of their available balance via Stripe Connect's built-in payout mechanism.
- **FR-022**: System MUST save album designs in progress so clients can return and continue editing.
- **FR-023**: System MUST enforce the photographer's maximum page count limit in the album designer.
- **FR-024**: System MUST allow clients to select album product options (size, cover, paper) before or during the design process.
- **FR-025**: System MUST allow photographers to download an export package of an approved album containing high-resolution spread images (JPEG/PNG) ready for print lab upload.

### Key Entities

- **Album Configuration**: Photographer-level settings that control whether album creation is enabled, the payment method, and the catalog of album products offered. Belongs to a photographer.
- **Album Product**: A specific album offering defined by the photographer, consisting of a unique size+cover+paper combination with a flat price and maximum page count. Each combination is a distinct product with its own price. Belongs to an album configuration.
- **Album Design**: A client's in-progress or completed album creation, containing selected product options, page layouts, image placements, and page ordering. Belongs to a client and is associated with a gallery.
- **Album Spread**: A pair of facing interior pages designed as a single surface (like an open book). Contains a layout template and one or more image placements with position/size data. Belongs to an album design.
- **Album Single Page**: A standalone page used for cover, first page, and last page of an album. Contains a layout template and image placements. Belongs to an album design.
- **Album Submission**: A record of a client submitting their album design for photographer review, including status (pending, approved, changes requested, rejected), photographer notes, and payment status. Links an album design to the review workflow.
- **Album Transaction**: A payment record for "inside Fotno" payments, capturing the client payment amount, transaction fee, and net amount credited to the photographer. Belongs to an album submission. Photographer earnings and payouts are managed by Stripe Connect (no custom balance entity needed).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clients can complete an album design (select layout, add images, customize, preview) and submit it in under 15 minutes for a 20-page album.
- **SC-002**: 90% of clients who start the album designer successfully submit an album design on first attempt without needing external help.
- **SC-003**: Photographers can configure their full album catalog (sizes, covers, papers, pricing) in under 10 minutes.
- **SC-004**: Album submissions are visible to photographers within 30 seconds of client submission.
- **SC-005**: The album designer loads and remains responsive (interactions feel instant) with galleries containing up to 500 images.
- **SC-006**: Photographers can review and take action on a submitted album (approve, request changes, reject) in under 2 minutes.
- **SC-007**: For "inside Fotno" payments, transaction fee deduction and photographer balance update occur within the same session as client payment.
- **SC-008**: Clients see only album options their photographer offers -- zero unauthorized options are ever displayed.

## Clarifications

### Session 2026-03-31

- Q: What is the album page design unit -- spreads, individual pages, or both? → A: Both. Interior pages use spreads (two facing pages as one design surface). Cover, first, and last pages are designed as individual pages.
- Q: How does the photographer get the album design after approval for production? → A: Downloadable export package with high-res spread images as JPEGs/PNGs ready for print lab upload.
- Q: How is album product pricing structured? → A: Flat price per product. Each size+cover+paper combination has one fixed price set by the photographer.
- Q: Can the photographer directly edit the client's album design during review? → A: No. Photographer can only approve, request changes (with notes), or reject. The client makes all edits.
- Q: Can a client create multiple albums from the same gallery? → A: Yes. Multiple albums per gallery are allowed, and multiple can be in-progress simultaneously.

## Assumptions

- Clients access the album designer via web browser on desktop; mobile-optimized album design is out of scope for v1.
- The existing gallery infrastructure and image delivery (S3/CloudFront) will be reused to serve images in the album designer.
- The existing authentication system (better-auth) will be used to identify clients and photographers.
- Notifications (status changes, submission received) will use the existing notification mechanism in the platform; the specific channel (email, in-app) follows current platform behavior.
- The transaction fee percentage for "inside Fotno" payments will be defined by Fotno and is not configurable by photographers.
- Album layout templates (predefined page arrangements) will be provided by the system; photographers do not create custom layouts. Separate layout templates exist for spreads (interior) and single pages (cover/first/last).
- Fotno is not responsible for printing, shipping, or producing the album -- the photographer handles all physical fulfillment after approval.
- The withdrawal mechanism for photographer earnings will integrate with the existing Stripe-based payment infrastructure.
- Album designs are stored as structured data (layout + image references + positions), not as rendered images.
- A client can create multiple album designs from the same gallery, and multiple can be in-progress simultaneously (e.g., a main album and a smaller parent album from the same wedding gallery).
