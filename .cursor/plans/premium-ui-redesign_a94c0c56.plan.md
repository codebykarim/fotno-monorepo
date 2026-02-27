---
name: premium-ui-redesign
overview: Comprehensive premium UI redesign across all 4 Fotno frontend apps (landing, dashboard, gallery, auth) and the shared UI package. Neutral palette with warm gold/amber accents, proper light/dark mode, consistent branding, and modern navigation patterns.
todos:
  - id: design-foundation
    content: "Phase 1: Update globals.css with warm gold palette (light+dark), replace logo SVG in icons.tsx, remove per-app theme.css files"
    status: pending
  - id: dark-mode
    content: "Phase 2: Wire next-themes ThemeProvider in all 4 apps, create shared ThemeToggle + ThemeProvider components"
    status: pending
  - id: dashboard-redesign
    content: "Phase 3: Remove sidebar, build premium top nav, polish all dashboard pages with warm accent"
    status: pending
  - id: landing-redesign
    content: "Phase 4: Redesign all landing page sections, replace template content/placeholders, add real Fotno messaging"
    status: pending
  - id: gallery-redesign
    content: "Phase 5: Premium gallery layout, warm accent touches, FOTNO branding, Inter font"
    status: pending
  - id: auth-redesign
    content: "Phase 6: Premium centered auth card, FOTNO logo, warm accent buttons, Inter font"
    status: pending
  - id: consistency-pass
    content: "Phase 7: Cross-app consistency check -- fonts, colors, dark mode, logo placement, mobile responsiveness"
    status: pending
isProject: false
---

# Premium UI Redesign

## Current State

4 Next.js apps + 1 shared UI package:

- **landing** -- marketing site with template content (placeholder screenshots, template logos like "Transistor", "Laravel", etc.)
- **dashboard** -- photographer workspace with sidebar + header layout
- **gallery** -- client-facing photo viewer
- **auth** -- login/register with its own warm brownish theme
- **packages/ui** -- shared shadcn/Radix components, `globals.css` with light+dark CSS vars

### Key Problems

- **Logo**: Current `Icons.logo` is a generic Lucide "activity" heartbeat SVG, not the real Fotno logo. The actual logo (`public/logo.png`) is cartoon-style with pink/blue colors -- it exists but is never used in code.
- **No dark mode**: `.dark` class vars exist in `globals.css` but no app uses `next-themes` ThemeProvider (dashboard has it as dependency but never wires it).
- **Inconsistent fonts**: Landing uses Inter, Dashboard uses Inter, Gallery uses Manrope, Auth uses Space Grotesk.
- **Inconsistent themes**: Each app has its own `theme.css` with different color values. Auth has warm browns, dashboard/gallery are pure monochrome.
- **Template/placeholder content**: Landing page has placeholder logos (Transistor, Tuple, etc.), template screenshots (payroll, expenses, etc.), and template SVG paths from a TaxPal-like template.
- **Navigation**: Dashboard sidebar is functional but heavy; header is simple logo+user.
- **No premium polish**: No subtle gradients, textures, animations beyond a basic `floatIn`.

## Design Direction

**Warm neutral + gold accent** -- think Squarespace meets Apple Photos. Clean, spacious, warm.

### Color Palette (light mode)

- **Background**: Warm off-white `oklch(0.985 0.005 85)` (barely warm, not clinical white)
- **Foreground**: Deep warm charcoal `oklch(0.18 0.01 50)`
- **Primary/Accent**: Warm amber-gold `oklch(0.72 0.14 65)` (rich but not flashy)
- **Muted**: Warm stone gray `oklch(0.95 0.005 80)`
- **Border**: Soft warm line `oklch(0.91 0.008 80)`

### Color Palette (dark mode)

- **Background**: Deep warm charcoal `oklch(0.16 0.01 50)`
- **Foreground**: Warm white `oklch(0.96 0.005 85)`
- **Primary/Accent**: Brighter gold for contrast `oklch(0.78 0.14 65)`
- **Card**: Slightly lifted surface `oklch(0.20 0.01 50)`

### Typography

- **One font everywhere**: Inter (already used in most apps, clean and professional)
- Tight letter-spacing on headings (`-0.02em`), normal on body

### Navigation (Dashboard)

- **Remove the sidebar entirely.** Replace with a **premium top nav bar**: logo on left, horizontal nav links (Overview, Galleries, Clients, Settings), user menu + theme toggle on right. This gives photographers maximum horizontal space for photo grids.
- Mobile: hamburger menu sliding in from top/side.

### Logo

- Replace the generic Lucide heartbeat SVG in `Icons.logo` with a proper SVG version derived from the real Fotno logo. For code, create a clean single-color SVG that works at small sizes (just the "F" letterform or a simplified camera-lens-inspired mark) alongside the "FOTNO" wordmark.
- Use the logo consistently in all headers, footers, auth pages, and favicon.

## Implementation Plan

### Phase 1: Design Foundation (shared UI package)

Update `[packages/ui/globals.css](packages/ui/globals.css)` with the new warm color palette for both `:root` (light) and `.dark` (dark) classes. This single change propagates to all apps.

Remove per-app `theme.css` overrides from dashboard, gallery, and auth so they all inherit from the shared palette.

Update `[packages/ui/src/components/icons.tsx](packages/ui/src/components/icons.tsx)` to replace the placeholder `logo` SVG with a proper FOTNO logo mark SVG (clean, single-color, scalable).

### Phase 2: Dark Mode Infrastructure

Wire up `next-themes` ThemeProvider in all 4 apps:

- Wrap each app's `layout.tsx` `<html>` with ThemeProvider (attribute="class", defaultTheme="system")
- Add a shared `ThemeToggle` component to `packages/ui` (sun/moon icon button)
- Place the toggle in the dashboard header, landing header, gallery, and auth pages

Files to modify:

- `[apps/dashboard/app/layout.tsx](apps/dashboard/app/layout.tsx)`
- `[apps/landing/app/layout.tsx](apps/landing/app/layout.tsx)`
- `[apps/gallery/app/layout.tsx](apps/gallery/app/layout.tsx)`
- `[apps/auth/app/layout.tsx](apps/auth/app/layout.tsx)`
- New: `packages/ui/src/components/theme-toggle.tsx`
- New: `packages/ui/src/components/theme-provider.tsx`

### Phase 3: Dashboard Redesign

**Navigation overhaul:**

- Delete `[apps/dashboard/components/dashboard-sidebar.tsx](apps/dashboard/components/dashboard-sidebar.tsx)`
- Redesign `[packages/ui/src/components/header.tsx](packages/ui/src/components/header.tsx)` as a full-featured top nav: FOTNO logo + wordmark on left, nav links center, storage indicator + theme toggle + user avatar on right
- Update `[apps/dashboard/app/layout.tsx](apps/dashboard/app/layout.tsx)` to remove sidebar layout, use full-width content under the top nav
- Delete `[apps/dashboard/app/theme.css](apps/dashboard/app/theme.css)` (use shared globals instead)

**Page polish (each page):**

- Overview: Premium stat cards with warm accent highlights, subtle gradients on key metrics
- Galleries: Refined card grid with better shadows, hover effects, warm accent on active states
- Gallery detail: Photo grid with subtle hover zoom, better upload progress UI
- Clients: Clean table with warm hover states
- Settings: Well-structured sections with clear hierarchy

### Phase 4: Landing Page Redesign

**Complete content overhaul** -- the current landing page is largely a template (TaxPal) with placeholder content:

- `[apps/landing/components/Hero.tsx](apps/landing/components/Hero.tsx)` -- Redesign with proper Fotno messaging. Remove placeholder company logos (Transistor, Tuple, etc). Add a hero image/mockup of the actual dashboard or gallery.
- `[apps/landing/components/Header.tsx](apps/landing/components/Header.tsx)` -- Use the real Fotno logo, warm accent CTA button, add theme toggle
- `[apps/landing/components/PrimaryFeatures.tsx](apps/landing/components/PrimaryFeatures.tsx)` -- Replace template screenshots (payroll, expenses, vat-returns) with actual Fotno feature descriptions and mockup images
- `[apps/landing/components/Pricing.tsx](apps/landing/components/Pricing.tsx)` -- Redesign pricing cards with warm accent on featured plan, premium feel
- `[apps/landing/components/CallToAction.tsx](apps/landing/components/CallToAction.tsx)` -- Warm gradient CTA section with gold accent
- `[apps/landing/components/Footer.tsx](apps/landing/components/Footer.tsx)` -- Clean footer with Fotno logo, proper links, dark background
- `[apps/landing/components/Testimonials.tsx](apps/landing/components/Testimonials.tsx)` -- Update styling for premium feel
- `[apps/landing/components/Faqs.tsx](apps/landing/components/Faqs.tsx)` -- Clean accordion style
- Remove placeholder assets from `[apps/landing/images/](apps/landing/images/)` (template screenshots, template logos)
- Standardize font to Inter (matching dashboard)

### Phase 5: Gallery App Redesign

- `[apps/gallery/app/layout.tsx](apps/gallery/app/layout.tsx)` -- Switch to Inter font, wire ThemeProvider, remove theme.css override
- `[apps/gallery/components/gallery/gallery-page-client.tsx](apps/gallery/components/gallery/gallery-page-client.tsx)` -- Premium photo grid with refined lightbox, warm accent on favorites/hearts, subtle shadows. Add FOTNO branding watermark/footer.
- `[apps/gallery/components/gallery/password-gate.tsx](apps/gallery/components/gallery/password-gate.tsx)` -- Premium lock screen with FOTNO logo, warm accent input focus
- Overall: minimal chrome, let photos breathe, with subtle warm touches on interactive elements

### Phase 6: Auth App Redesign

- `[apps/auth/app/layout.tsx](apps/auth/app/layout.tsx)` -- Switch to Inter font, wire ThemeProvider, remove auth-specific theme.css
- `[apps/auth/components/unified-auth-form.tsx](apps/auth/components/unified-auth-form.tsx)` -- Premium auth card centered on page with FOTNO logo above. Warm accent on CTA buttons. Subtle warm background gradient matching the new palette.
- Overall: clean, centered, premium feel with consistent branding

### Phase 7: Consistency Pass

- Verify all apps use Inter
- Verify all apps support light/dark mode
- Verify FOTNO logo appears in all nav bars and key locations
- Verify warm accent is consistent everywhere
- Test mobile responsiveness for top nav, landing sections, gallery
- Remove all leftover template/placeholder content

## File Change Summary

**Shared package (packages/ui):**

- `globals.css` -- new warm palette for light + dark
- `src/components/icons.tsx` -- real Fotno logo SVG
- `src/components/header.tsx` -- full-featured top nav with theme toggle
- New: `src/components/theme-toggle.tsx`
- New: `src/components/theme-provider.tsx`
- `tailwind.config.ts` -- no major changes needed (theme comes from CSS vars)

**Dashboard (apps/dashboard):**

- `app/layout.tsx` -- ThemeProvider, remove sidebar, use top nav
- `app/theme.css` -- delete (use shared globals)
- `components/dashboard-sidebar.tsx` -- delete
- All page components -- polish with warm accent, premium spacing/shadows

**Landing (apps/landing):**

- `app/layout.tsx` -- ThemeProvider, Inter font, dark mode
- All section components -- redesign with Fotno content, remove template placeholders
- Remove template assets from `images/`

**Gallery (apps/gallery):**

- `app/layout.tsx` -- ThemeProvider, Inter font
- `app/theme.css` -- delete
- Gallery components -- premium photo grid, warm accent touches

**Auth (apps/auth):**

- `app/layout.tsx` -- ThemeProvider, Inter font
- `app/theme.css` -- delete
- Auth form -- centered premium card, FOTNO logo, warm CTA

