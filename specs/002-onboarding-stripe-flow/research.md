# Research: Onboarding Flow with Stripe Subscription Step

**Branch**: `002-onboarding-stripe-flow` | **Date**: 2026-03-29

## R1: Stripe Elements vs Current Checkout Sessions

**Decision**: Add Stripe Elements (embedded) for the onboarding flow; keep existing Checkout Sessions for dashboard billing page.

**Rationale**: The spec requires an inline payment form that keeps users within the onboarding flow. Stripe Elements with `@stripe/react-stripe-js` provides embeddable card/payment components. The existing Checkout Session redirect flow in the dashboard billing page remains unchanged.

**Alternatives considered**:
- Stripe Checkout Sessions only (current approach) — rejected because it redirects users away from the onboarding flow, breaking context.
- Stripe Payment Links — rejected because they offer even less customization than Checkout Sessions.
- Stripe Embedded Checkout (iframe) — viable but less flexible than Elements for styling/UX integration.

**Implementation approach**:
- For **paid plan subscriptions**: Use `stripe.subscriptions.create()` server-side with a PaymentIntent, paired with `<PaymentElement>` client-side to collect payment details inline.
- For **free plan card saving**: Use `stripe.setupIntents.create()` server-side with `<PaymentElement>` client-side (mode: setup). No charge applied.
- New backend endpoints needed: `POST /api/billing/create-subscription-intent` and `POST /api/billing/create-setup-intent`.
- New frontend packages needed: `@stripe/stripe-js` and `@stripe/react-stripe-js` in the auth app.

## R2: Onboarding Flow Host Application

**Decision**: Host the onboarding flow in the auth app (`apps/auth/`).

**Rationale**: The auth app already handles signup (account creation). After signup, users naturally remain in the auth app for the Stripe step before being redirected to the dashboard. This avoids a redirect to the dashboard just to redirect again to onboarding. The cross-subdomain cookie setup (`.fotno.com`) ensures the session persists when the user eventually navigates to the dashboard.

**Alternatives considered**:
- Dashboard app with onboarding routes — rejected because unauthenticated users would hit the dashboard middleware, requiring complex exception logic. Also adds a redirect hop (auth → dashboard onboarding → dashboard).
- Separate onboarding app — rejected per constitution principle I (Monorepo Cohesion) and spec assumption (not a separate service). Would add operational overhead.

## R3: Plan Parameter Passing from Landing to Auth

**Decision**: Modify landing page pricing buttons to append `?plan=<tier_label>` query parameter to the auth URL.

**Rationale**: Currently, the landing page links to `/account` with no plan context. The auth app already reads `searchParams.get("plan")` (line 113 in unified-auth-form.tsx) but only displays it in the subtitle. The parameter needs to be:
1. Passed from landing pricing buttons → auth URL
2. Persisted through signup into the onboarding Stripe step
3. Used to determine which Stripe flow to show (setup intent vs subscription)

**Implementation approach**:
- "Get Started" button (no plan context) → defaults to Free plan in onboarding
- Pricing tier buttons → append `?plan=Starter`, `?plan=Professional`, etc.
- Free tier button → append `?plan=Free`
- Auth form stores plan in component state and passes it to the onboarding steps

## R4: Onboarding Completion Gating

**Decision**: Use the existing `finishOnboarding` field on the User model to gate dashboard access.

**Rationale**: The field already exists in the Prisma schema (nullable Boolean, default false), is defined in better-auth's `additionalFields`, and is available in the session (`ExtendedSession`). The dashboard middleware already checks session state — extending it to check `finishOnboarding` is straightforward.

**Implementation approach**:
- Dashboard middleware: if `session.user.finishOnboarding !== true`, redirect to `${NEXT_PUBLIC_AUTH_URL}/onboarding?resume=true`
- Auth app: after Stripe step completion (or skip), call API to set `finishOnboarding: true`, then redirect to dashboard
- Backend: new endpoint `POST /api/user/complete-onboarding` to set the flag

## R5: Rybbit Tracking in Auth App

**Decision**: Add Rybbit script loading to the auth app layout for onboarding event tracking.

**Rationale**: Currently Rybbit is only loaded in the landing and gallery apps. The onboarding flow lives in the auth app, so tracking events (`onboarding_started`, `stripe_step_viewed`, etc.) require Rybbit to be available. The same rewrite pattern used in the landing app can be applied.

**Implementation approach**:
- Add Rybbit script tag to `apps/auth/app/layout.tsx`
- Add Rybbit API rewrites to `apps/auth/next.config.ts`
- Use the same `window.rybbit.event()` pattern as `TrackRybbitButton`
- Create a shared tracking utility or use inline calls in onboarding components

## R6: OAuth Onboarding Path

**Decision**: After OAuth signup completes, redirect to an onboarding route in the auth app that shows only the Stripe step.

**Rationale**: OAuth users (Google/GitHub) complete account creation through the OAuth provider. better-auth handles the callback and creates the user with `finishOnboarding: false`. The user needs to pass through the Stripe step before reaching the dashboard.

**Implementation approach**:
- Modify the OAuth `callbackURL` to point to `/onboarding?step=stripe&plan=<selected_plan>` in the auth app
- The onboarding page detects that account info is already complete (user exists in session) and shows only the Stripe step
- Same skip/complete logic applies
- Plan context passed via query parameter from landing → auth → OAuth callback → onboarding

## R7: Onboarding State Persistence (Mid-Flow Resume)

**Decision**: Use server-side state (the `finishOnboarding` flag) combined with client-side query parameters for step tracking.

**Rationale**: The onboarding flow has only two steps (account info + Stripe). If the user completes account creation but abandons before the Stripe step, their account exists with `finishOnboarding: false`. On return:
- Dashboard middleware detects incomplete onboarding, redirects to auth app
- Auth app detects existing session, skips account info, shows Stripe step
- No need for a separate onboarding session table — the flag + session state is sufficient

**Alternatives considered**:
- Client-side localStorage for step tracking — rejected because it doesn't survive cross-device or cleared storage.
- Dedicated `OnboardingSession` database table — over-engineered for a 2-step flow. The existing `finishOnboarding` flag suffices.
