# Research: Smart Album Workflow

**Branch**: `003-smart-album-workflow` | **Date**: 2026-03-31

## R1: Existing Album Model Conflict

**Decision**: Use `SmartAlbum` prefix for all new entities to avoid collision with existing `Album` model.

**Rationale**: The existing `Album` model is a simple photo grouping/folder within a gallery (title + photos). The new feature represents a completely different concept -- a designed physical print album with layouts, spreads, image positioning, and a review/payment workflow. Using a distinct prefix avoids breaking existing functionality and makes the domain boundary clear.

**Alternatives considered**:
- Rename existing `Album` to `PhotoGroup` -- rejected: breaking change across all existing routes, services, and frontend references.
- Extend existing `Album` with optional design fields -- rejected: fundamentally different purpose; would create a confusing hybrid model.

## R2: Album Designer Architecture (Client-Side)

**Decision**: Build the album designer as a new page within the `gallery` app, using a canvas-based layout editor with React state management (Zustand).

**Rationale**: The designer is a client-facing feature accessed from the gallery. Keeping it in the `gallery` app maintains the existing access pattern (shareToken-based, no photographer auth required). Canvas-based rendering provides the pixel-precise positioning needed for album page layouts, while Zustand handles complex editor state (pages, selections, undo/redo).

**Alternatives considered**:
- Separate standalone app -- rejected: would require a new service, separate deployment, and duplicate gallery image access logic.
- Dashboard-based designer -- rejected: clients don't have dashboard access; this is a client-facing feature.
- DOM-based layout (CSS Grid/Flexbox) -- rejected: insufficient control for precise image cropping, positioning, and resize handles.

## R3: Image Export Strategy for Print

**Decision**: Server-side rendering of high-resolution spread/page images using Sharp (Node.js), triggered on-demand when the photographer clicks "Download Export" after approval.

**Rationale**: Print-ready exports require compositing multiple high-resolution images at exact positions onto a spread canvas. Sharp is already a project dependency (used by image-processor) and handles compositing well. On-demand generation avoids storing large files unnecessarily. The export job can run as a backend service task.

**Alternatives considered**:
- Client-side canvas export -- rejected: browsers can't handle compositing multiple 20+ megapixel originals; memory limits, no access to original resolution files.
- Pre-render on submission -- rejected: wastes resources if the photographer rejects or requests changes.
- PDF generation -- rejected: print labs typically accept JPEG/PNG spreads, not PDFs; adds unnecessary dependency.

## R4: Album Design Data Storage

**Decision**: Store album designs as structured JSON data (layout references, image IDs, position/size coordinates per slot) in the database, not as rendered images.

**Rationale**: Structured data enables editing, versioning, and re-rendering at any resolution. The album designer reconstructs the visual layout from this data on the client side using preview-resolution images. Only the final export renders full-resolution output.

**Alternatives considered**:
- Store rendered page images -- rejected: prevents editing, consumes massive storage, requires re-rendering on any change.
- Store as a file (JSON file on S3) -- rejected: adds complexity for a feature that needs database queries (filtering by status, listing submissions); structured data fits better in PostgreSQL JSONB.

## R5: Payment Flow for "Inside Fotno"

**Decision**: Use Stripe Payment Intents for one-time album payments. The photographer's Stripe Connect account receives the payment minus Fotno's platform fee. Photographer withdrawal happens through Stripe Connect payouts.

**Rationale**: Stripe Connect is the standard pattern for marketplace payments where a platform facilitates transactions between buyers and sellers. The existing Stripe integration (subscriptions) provides the foundation. Payment Intents handle one-time charges cleanly. Stripe Connect manages payout scheduling, reducing Fotno's compliance burden.

**Alternatives considered**:
- Manual balance tracking + bank transfer -- rejected: requires Fotno to handle money transmission, increases regulatory risk.
- Stripe Checkout Sessions (one-time) -- rejected: Payment Intents offer more control for embedded payment forms and are better for marketplace flows with Connect.

## R6: Notification Mechanism

**Decision**: Use the existing notification pattern in the platform. Based on research, the gallery app uses Server-Sent Events (SSE) for real-time updates (comments). Album status change notifications will follow the same pattern for in-app notifications, with email notifications sent via Resend for critical status changes (submitted, approved, rejected).

**Rationale**: Leverages existing infrastructure. SSE is already proven in the gallery app. Resend is the established email provider.

**Alternatives considered**:
- WebSockets -- rejected: SSE is already implemented and sufficient for one-directional status updates.
- Polling -- rejected: less responsive than SSE; wastes resources.

## R7: Layout Templates

**Decision**: Ship a curated set of 15-20 predefined layout templates covering common album design patterns (full-bleed single image, 2-image split, 3-image grid, etc.). Templates are defined as JSON configuration stored in the codebase (not database), versioned with the application.

**Rationale**: Predefined templates keep the MVP scope manageable while covering the most common album layouts. Storing in codebase (not database) simplifies deployment and avoids needing an admin UI for template management in v1. SmartAlbums offers ~60 layouts; starting with 15-20 covers the essential patterns.

**Alternatives considered**:
- Database-stored templates with admin CRUD -- rejected for v1: unnecessary complexity; can be added later.
- Fully freeform placement (no templates) -- rejected: makes it too hard for non-designer clients; templates provide guardrails.
- Photographer-created custom templates -- rejected for v1: significant UX complexity; spec assumes system-provided templates.

## R8: Auto-Save Strategy

**Decision**: Auto-save album designs with debounced writes (2-second delay after last change). Store the full design state as a JSONB column on the SmartAlbumDesign record. Optimistic UI updates with background persistence.

**Rationale**: Clients expect their work to be saved automatically (spec FR-022). Debounced writes balance responsiveness with database load. JSONB provides flexible schema evolution for the design data without migrations.

**Alternatives considered**:
- Manual save button only -- rejected: clients lose work on accidental navigation or browser crash.
- Real-time sync (e.g., CRDT) -- rejected: overkill for single-user editing; no collaborative editing requirement.
- LocalStorage + periodic sync -- rejected: data loss if client clears browser data; harder to resume on different device.
