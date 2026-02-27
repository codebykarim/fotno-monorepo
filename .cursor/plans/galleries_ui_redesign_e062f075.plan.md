---
name: Galleries UI Redesign
overview: Comprehensive redesign of the galleries list page, gallery cards, and the entire gallery detail page (photos, albums, settings, header) to match the premium warm-gold design direction established in the existing design plan.
todos:
  - id: backend-preview-urls
    content: Update listGalleries.ts to return previewPhotoUrls (up to 12 thumbnail URLs) and update GalleryListItem type in api.ts
    status: completed
  - id: filter-bar
    content: "Redesign galleries-list-content.tsx filter bar: search with icon, pill status toggles, compact sort dropdown"
    status: completed
  - id: gallery-card
    content: Redesign gallery-card.tsx with mosaic photo grid, compact info footer, hover actions; update skeleton and status badge
    status: completed
  - id: detail-header
    content: "Redesign gallery detail header: compact title/slug, inline stats pills, quick-action buttons (publish switch, password lock, share, QR)"
    status: completed
  - id: detail-tabs
    content: Redesign tab bar to underline style, wire ShareTab back into tabs array
    status: completed
  - id: photos-tab
    content: "Redesign photos tab: inline upload strip above grid, cleaner selection toolbar, improved photo tiles with hover checkbox and context menu"
    status: completed
  - id: albums-tab
    content: "Redesign albums tab: visual album cards with hero thumbnail, preview strip, dropdown actions, Add Album button"
    status: completed
  - id: settings-tab
    content: "Redesign settings tab: compact title/slug, calendar date pickers, prominent password switch, remove publish (moved to header), polish danger zone"
    status: completed
isProject: false
---

# Galleries UI Redesign

## Scope

Redesign all gallery-related dashboard UI across **7 files** (+ 1 backend service for the card image grid data):

- [apps/dashboard/components/dashboard/galleries-list-content.tsx](apps/dashboard/components/dashboard/galleries-list-content.tsx) -- list page with filters
- [apps/dashboard/components/dashboard/gallery-card.tsx](apps/dashboard/components/dashboard/gallery-card.tsx) -- individual gallery card
- [apps/dashboard/components/dashboard/gallery-card-skeleton.tsx](apps/dashboard/components/dashboard/gallery-card-skeleton.tsx) -- skeleton loader
- [apps/dashboard/components/dashboard/gallery-status-badge.tsx](apps/dashboard/components/dashboard/gallery-status-badge.tsx) -- status indicator
- [apps/dashboard/components/dashboard/gallery-detail-content.tsx](apps/dashboard/components/dashboard/gallery-detail-content.tsx) -- the 2100-line detail page (header, photos tab, albums tab, settings tab)
- [apps/dashboard/lib/types/api.ts](apps/dashboard/lib/types/api.ts) -- add `previewPhotoUrls` to `GalleryListItem`
- [apps/backend/src/services/DashboardServices/listGalleries.ts](apps/backend/src/services/DashboardServices/listGalleries.ts) -- return thumbnail URLs for card grid

---

## 1. Backend: Return Photo Grid URLs for Gallery Cards

Currently `listGalleries.ts` returns only `coverPhotoUrl`. To show a mosaic grid on cards, we need an array of up to 12 thumbnail URLs.

**Changes to** `listGalleries.ts`:

- After finding the ordered photos, presign up to 12 thumbnail/preview URLs
- Return new field `previewPhotoUrls: string[]` alongside existing `coverPhotoUrl`

**Changes to** `api.ts`:

- Add `previewPhotoUrls: string[]` to `GalleryListItem` type

---

## 2. Galleries List: Filter Bar Redesign

**Current**: 3 inputs in a bordered `rounded-2xl` box (search input + 2 Select dropdowns side by side).

**New design**: Clean inline toolbar row -- a search input with a search icon on the left, and compact pill-style filter buttons (status toggle chips: All / Draft / Published) and a single sort dropdown on the right. No enclosing box/border -- the filters sit directly in the page flow, lighter and more breathable.

```
[Search icon] Search galleries...          [All] [Draft] [Published]   [Sort: Newest v]
```

---

## 3. Gallery Card: Photo Mosaic Grid

**Current**: Single cover photo (4:3 aspect ratio) with title, date, photo count, status badge below.

**New design**: A card that shows a **3x4 or 4x3 mosaic thumbnail grid** using `previewPhotoUrls` (up to 12 photos). Layout:

- Top: mosaic grid of small thumbnails filling the card area. If fewer than 12 photos, remaining cells show as muted placeholders. If 0 photos, show an empty state.
- Bottom: compact info row -- gallery title (medium weight, not oversized), photo count as a small pill, status dot (green for published, gray for draft), and a subtle "..." menu.
- Remove the date/deadline from the card (it's too noisy -- these details belong in the detail page).
- On hover: subtle lift + shadow, overlay with quick-action buttons (Open, Share, Delete).
- Skeleton: Update to match mosaic grid layout.

---

## 4. Gallery Detail: Header Redesign

**Current** (lines 192-281): Large "Workspace" label, oversized `text-4xl font-light` title, 2x2 stat grid (Photos, Albums, Status, Share link), and a QR code block.

**New design**: Compact, premium header:

- **Top bar**: Gallery title as `text-2xl font-medium` on the left, with inline editable slug shown as `/{slug}` in muted text beside it. On the right: quick-action buttons in a row:
  - **Publish toggle**: A prominent `Switch` component (not buried in settings) with "Draft" / "Published" label
  - **Password lock icon**: A lock/unlock icon button that opens an inline popover to set/toggle password -- visually obvious
  - **Share button**: Copy link button (only enabled when published)
  - **QR code button**: Opens a popover/dialog with QR code
- **Stats row below title**: Compact inline pills -- `42 photos` / `3 albums` / `Event: Mar 15` / `Deadline: Apr 1` -- using subtle muted background pills, not bordered boxes. Dates formatted nicely (e.g., "Mar 15, 2025") not raw ISO strings.
- Remove the QR code from being always visible -- move it behind a button.

---

## 5. Gallery Detail: Tabs Redesign

**Current** (lines 283-303): 3 tabs (Photos, Albums, Settings) in a muted background row.

**New design**: Keep the tab structure but **add a 4th "Share" tab** back (the component already has a `ShareTab` function defined but it's not wired into the tabs array). Redesign the tab bar:

- Use underline-style tabs instead of pill-in-muted-bg style
- Tabs: Photos | Albums | Settings | Share
- Active tab has a warm gold underline accent and bold text

---

## 6. Gallery Detail: Photos Tab Redesign

**Current** (lines 1202-1560): Two-column layout -- left side has a sticky toolbar + masonry photo grid, right side has upload card in a sidebar.

**New design**:

### Upload zone

- Move the upload dropzone **above** the photo grid as a collapsible bar / always-visible drag target strip. When files are being uploaded, expand to show the upload queue. This frees the full width for the photo grid.
- Upload strip: thin horizontal bar with dashed border, "Drag photos here or click to upload" text, and an upload icon. Expands when files are queued.

### Selection toolbar

- Redesign the sticky toolbar: cleaner, with:
  - Left: Checkbox "Select all" toggle + count badge (`12 selected`)
  - Right: Action buttons appear only when selection > 0 (slide in): "Add to Album", "Set as Cover" (1 selected only), "Delete" -- all as icon+text compact buttons

### Photo grid

- Keep the masonry/columns layout but improve each photo tile:
  - Rounded corners, subtle shadow on hover
  - Selection: Checkbox appears top-left on hover, blue border ring when selected (not dark overlay)
  - Cover star badge: small gold star icon badge in the corner (always visible for cover photo)
  - No destructive (red delete) button on each photo -- bulk actions handle deletion
  - Context menu on right-click or "..." button: Set as Cover, Add to Album, Delete

---

## 7. Gallery Detail: Albums Tab Redesign

**Current** (lines 1563-1727): Basic card grid with album title, Rename/Delete buttons, and tiny 64x64 thumbnail strips.

**New design**: Visual album cards similar to Apple Photos / Lightroom:

- Each album card shows a **larger hero thumbnail** (the first photo in the album) at the top, with a title overlay at the bottom
- Below the hero image: photo count and a row of 4-5 small thumbnails as a preview strip
- Actions: "..." dropdown menu (Rename, Delete) instead of inline buttons
- Empty state: A nice illustration/icon with "No albums yet. Select photos and group them into albums."
- Add an "Add Album" button at the top of the tab

---

## 8. Gallery Detail: Settings Tab Redesign

**Current** (lines 1730-1965): 3-column grid with a large settings card (title, slug, date, deadline, password checkbox, publish checkbox, save button) and a danger zone card.

**New design**: Organized into clear sections with better controls:

### General section

- Title and Slug side by side in a compact 2-column row (not full width each)
- Slug shown with a prefix indicator: `yourdomain.com/` before the slug input

### Dates section

- Event Date and Deadline side by side, using a proper **calendar popover** (shadcn `DatePicker` with `Popover` + `Calendar`) instead of native `<input type="date">`
- Show formatted dates like "March 15, 2025"

### Access section (password protection -- made prominent)

- A `Switch` toggle for password protection with a lock icon and clear labeling
- When enabled, the password input slides in below with a show/hide toggle
- Visually distinct section with a subtle border/background

### Publish section (removed -- moved to header quick actions)

- Publishing is now a toggle in the header bar, not in settings

### Danger Zone

- Keep the existing danger zone design (user said they "kinda like it") but polish:
  - Slightly tighter spacing
  - Clearer warning icon

### Save button

- Sticky bottom bar with the save button, or auto-save with debounce

---

## Key Design Principles

- **Warm gold accent** (`oklch(0.72 0.14 65)` / primary) on interactive elements, focus rings, active states
- **Spacious but compact** -- reduce oversized headings and wasted space
- **Consistent with existing palette** in `globals.css` -- no new color variables needed
- **shadcn/Radix components** throughout (Switch, Popover, Calendar, DropdownMenu)
- **Dark mode compatible** -- all new styles using CSS variables / Tailwind classes

---

## File Change Summary


| Area | File | Change Scope |
| ---- | ---- | ------------ |


**Backend:**

- `listGalleries.ts` -- add `previewPhotoUrls` array (up to 12 presigned thumbnail URLs)

**Dashboard types:**

- `api.ts` -- add `previewPhotoUrls: string[]` to `GalleryListItem`

**Dashboard components:**

- `galleries-list-content.tsx` -- redesign filter bar (search + pill filters + sort)
- `gallery-card.tsx` -- mosaic thumbnail grid + compact info footer
- `gallery-card-skeleton.tsx` -- update skeleton to match new card layout
- `gallery-status-badge.tsx` -- simplify to dot indicator
- `gallery-detail-content.tsx` -- redesign header, tabs, photos tab, albums tab, settings tab (this is the bulk of work, ~1500 lines of changes in a 2100-line file)

**New shadcn components that may need installing:**

- `Switch` (for publish/password toggles)
- `Calendar` + `Popover` (for date picker)
- Check if already available in `packages/ui`

