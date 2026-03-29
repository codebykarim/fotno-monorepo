# Tasks: Onboarding Flow with Stripe Subscription Step

**Input**: Design documents from `/specs/002-onboarding-stripe-flow/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Manual testing per quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies and configure environment for Stripe Elements

- [ ] T001 Install @stripe/stripe-js and @stripe/react-stripe-js in the auth app via `pnpm --filter auth add @stripe/stripe-js @stripe/react-stripe-js`
- [ ] T002 Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable to .env and document in apps/auth/Dockerfile build args

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend endpoints, middleware gate, Rybbit setup, and landing page URL changes that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Create completeOnboarding service in apps/backend/src/services/UserServices/completeOnboarding.ts — sets User.finishOnboarding = true, returns { data: { finishOnboarding: true }, status: 200 }, idempotent
- [ ] T004 [P] Create createSubscriptionIntent service in apps/backend/src/services/SubscriptionServices/createSubscriptionIntent.ts — guard against existing active subscription (return 409), create Stripe customer if needed, calls stripe.subscriptions.create() with payment_behavior: "default_incomplete", supports regional pricing, returns { data: { subscriptionId, clientSecret }, status: 201 }
- [ ] T005 [P] Create createSetupIntent service in apps/backend/src/services/SubscriptionServices/createSetupIntent.ts — creates Stripe customer if needed, calls stripe.setupIntents.create(), returns { data: { clientSecret }, status: 201 }
- [ ] T006 Register new routes with Joi validation schemas: POST complete-onboarding in apps/backend/src/routes/userRoutes.ts (isAuth middleware, no body validation needed), POST create-subscription-intent in apps/backend/src/routes/billingRoutes.ts (isAuth middleware, Joi schema: tierLabel required string, countryCode optional string), POST create-setup-intent in apps/backend/src/routes/billingRoutes.ts (isAuth middleware, no body validation needed)
- [ ] T007 [P] Add onboarding gate to dashboard middleware in apps/dashboard/middleware.ts — after session check, if session.user.finishOnboarding !== true, redirect to ${NEXT_PUBLIC_AUTH_URL}/onboarding?resume=true
- [ ] T008 [P] Add Rybbit analytics to auth app: add Script tag in apps/auth/app/layout.tsx, add /api/script.js and /api/track rewrites in apps/auth/next.config.ts (same pattern as apps/landing/next.config.ts)
- [ ] T009 [P] Add ?plan= query parameter to all landing page signup links: apps/landing/components/Hero.tsx, apps/landing/components/CallToAction.tsx, apps/landing/components/Header.tsx (default ?plan=Free for Get Started buttons), apps/landing/components/Pricing.tsx (append ?plan=<tier.label> for each plan button)

**Checkpoint**: Foundation ready — all backend endpoints callable, dashboard gates onboarding, landing passes plan context, Rybbit available in auth app

---

## Phase 3: User Story 1 — New User Free Plan Onboarding (Priority: P1) MVP

**Goal**: A new user clicks Get Started, creates an account (email/name/password), sees the Stripe step, skips it, and lands on the dashboard with Free tier access

**Independent Test**: Navigate to landing → click Get Started → fill account form → skip Stripe step → verify dashboard loads with Free tier

### Implementation for User Story 1

- [ ] T010 [US1] Create onboarding server component page in apps/auth/app/onboarding/page.tsx — read searchParams (plan, step, resume), check session via getSession(), determine initial step (account vs stripe based on session presence), render OnboardingFlow client component
- [ ] T011 [US1] Create onboarding flow orchestrator client component in apps/auth/components/onboarding/onboarding-flow.tsx — manages step state (account → stripe), receives plan and initialStep as props, renders current step component, handles step transitions
- [ ] T012 [US1] Create account info step component in apps/auth/components/onboarding/account-info-step.tsx — email/name/password form using @workspace/ui Form components + React Hook Form + Zod validation (reuse password rules: min 8 chars, 1 uppercase, 1 number, 1 special char), check email uniqueness, call signUp.email() from @workspace/lib auth client, on success advance to stripe step
- [ ] T013 [US1] Create stripe step component (skip-only for MVP) in apps/auth/components/onboarding/stripe-step.tsx — display selected plan info, show prominent Skip button, on skip: call POST /api/user/complete-onboarding, then redirect to NEXT_PUBLIC_DASHBOARD_URL
- [ ] T014 [US1] Modify unified-auth-form.tsx to redirect to /onboarding after signup in apps/auth/components/unified-auth-form.tsx — change postAuthRedirectUrl for new signups to /onboarding?plan=<plan>&step=stripe, preserve plan from searchParams through signup flow, also update OAuth callbackURL to /onboarding?step=stripe&plan=<plan>
- [ ] T015 [US1] Handle resume flow in onboarding page: if session exists and finishOnboarding is false, set initialStep to stripe (skip account info); if session exists and finishOnboarding is true, redirect to dashboard immediately in apps/auth/app/onboarding/page.tsx
- [ ] T016 [US1] Handle edge case: email already registered in account info step — show "Email already taken" message with link to sign in at /account in apps/auth/components/onboarding/account-info-step.tsx

**Checkpoint**: Free plan onboarding works end-to-end. New users can create account and reach dashboard by skipping Stripe step. Dashboard blocks access for users with finishOnboarding = false.

---

## Phase 4: User Story 2 — Paid Plan Subscription During Onboarding (Priority: P1)

**Goal**: A user selects a paid plan from pricing, creates account, completes inline Stripe payment, and lands on dashboard with paid plan active

**Independent Test**: Navigate to landing → select Professional plan → fill account form → enter test card (4242...) → verify dashboard loads with Professional plan active

### Implementation for User Story 2

- [ ] T017 [US2] Integrate Stripe Elements in stripe step: add Elements provider with loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY), for paid plans call POST /api/billing/create-subscription-intent to get clientSecret, render PaymentElement inside Elements provider in apps/auth/components/onboarding/stripe-step.tsx
- [ ] T018 [US2] Implement payment confirmation flow in stripe step: on form submit call stripe.confirmPayment() with clientSecret, handle succeeded/processing/error states, on success call POST /api/user/complete-onboarding then redirect to dashboard in apps/auth/components/onboarding/stripe-step.tsx
- [ ] T019 [US2] Implement paid plan skip logic: when user skips on a paid plan, display confirmation ("You'll start on the Free plan instead"), on confirm call POST /api/user/complete-onboarding with no subscription, redirect to dashboard on Free tier in apps/auth/components/onboarding/stripe-step.tsx
- [ ] T020 [US2] Handle payment errors in stripe step: display Stripe error messages (declined card, insufficient funds, network error), allow retry with same or different card, maintain skip option as fallback in apps/auth/components/onboarding/stripe-step.tsx

**Checkpoint**: Both free and paid plan onboarding work. Users selecting paid plans see inline Stripe Elements, can pay or skip.

---

## Phase 5: User Story 3 — Conversion and Funnel Event Tracking (Priority: P2)

**Goal**: Every onboarding step emits tracking events via Rybbit for funnel analysis

**Independent Test**: Walk through onboarding flow, verify in browser console that window.rybbit.event() fires for each step with correct event name and metadata

### Implementation for User Story 3

- [ ] T021 [P] [US3] Add onboarding_started event (with plan context) on flow mount and onboarding_completed event (with outcome: subscribed/free) on dashboard redirect in apps/auth/components/onboarding/onboarding-flow.tsx
- [ ] T022 [P] [US3] Add stripe_step_viewed event on stripe step mount, subscription_started event (with plan name) on payment success, and subscription_skipped event (with original plan) on skip in apps/auth/components/onboarding/stripe-step.tsx

**Checkpoint**: All 5 tracking events fire at correct moments with correct metadata. Funnel data available in Rybbit.

---

## Phase 6: User Story 4 — Free Plan Card Save (Priority: P3)

**Goal**: Free plan users can optionally save a card during onboarding without being charged

**Independent Test**: Select Free plan → create account → on Stripe step choose "Add card" → enter test card → verify no charge in Stripe, card saved, user on Free tier in dashboard

### Implementation for User Story 4

- [ ] T023 [US4] Add card-save option to stripe step for free plan users: show "Add a payment card (optional, no charge)" button alongside Skip, when clicked call POST /api/billing/create-setup-intent to get clientSecret, render PaymentElement in setup mode in apps/auth/components/onboarding/stripe-step.tsx
- [ ] T024 [US4] Handle card save confirmation: call stripe.confirmSetup() on submit, display "No charge will be applied" messaging, on success call POST /api/user/complete-onboarding then redirect to dashboard on Free tier in apps/auth/components/onboarding/stripe-step.tsx

**Checkpoint**: Free plan users can save card or skip. Card-on-file enables frictionless future upgrades from dashboard billing page.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, error handling refinements, and end-to-end validation

- [ ] T025 [P] Add loading states: skeleton/spinner while Stripe Elements initializes, disable submit button during API calls, show progress indicator (step 1 of 2 / step 2 of 2) in onboarding flow in apps/auth/components/onboarding/onboarding-flow.tsx and stripe-step.tsx
- [ ] T026 [P] Add Stripe Elements appearance customization to match auth app theme (colors, fonts, border radius via Tailwind CSS variables) in apps/auth/components/onboarding/stripe-step.tsx
- [ ] T027 Validate all quickstart.md scenarios end-to-end: Free plan skip, Paid plan subscribe, Free plan card save, OAuth flow, Resume flow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001 for Stripe packages) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational phase completion — MVP
- **US2 (Phase 4)**: Depends on US1 (builds on stripe step component)
- **US3 (Phase 5)**: Depends on US1 (requires onboarding components to exist for event placement)
- **US4 (Phase 6)**: Depends on US2 (reuses PaymentElement infrastructure)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — creates all core onboarding components
- **US2 (P1)**: Depends on US1 — extends stripe-step.tsx with Stripe Elements
- **US3 (P2)**: Depends on US1 — adds tracking calls to existing components; can run in parallel with US2 if only adding to onboarding-flow.tsx
- **US4 (P3)**: Depends on US2 — reuses Elements provider and PaymentElement patterns

### Within Each User Story

- Page/layout before components
- Backend services before frontend API calls
- Core flow before edge cases
- Complete story before moving to next

### Parallel Opportunities

- Phase 2: T003, T004, T005 (backend services) can all run in parallel
- Phase 2: T007, T008, T009 (different apps) can all run in parallel
- Phase 5: T021 and T022 (different components) can run in parallel
- Phase 7: T025 and T026 (different concerns in different files) can run in parallel

---

## Parallel Example: Foundational Phase

```
# These 6 tasks touch different files and can run in parallel:
T003: completeOnboarding service in apps/backend/
T004: createSubscriptionIntent service in apps/backend/  (different file from T003)
T005: createSetupIntent service in apps/backend/  (different file from T003, T004)
T007: dashboard middleware in apps/dashboard/
T008: Rybbit in apps/auth/layout + next.config
T009: landing page URLs in apps/landing/components/

# T006 depends on T003-T005 (registers their routes):
T006: register routes in billingRoutes.ts and userRoutes.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install packages)
2. Complete Phase 2: Foundational (backend + middleware + landing URLs)
3. Complete Phase 3: User Story 1 (free plan onboarding with skip)
4. **STOP and VALIDATE**: New users can sign up and reach dashboard via onboarding
5. Deploy if ready — users can onboard even without payment integration

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add US1 → Free plan onboarding works → Deploy (MVP!)
3. Add US2 → Paid plan subscriptions work → Deploy
4. Add US3 → Tracking events fire → Deploy
5. Add US4 → Card-on-file for free users → Deploy
6. Polish → Loading states, theme matching → Deploy

### Key Risk: Stripe Elements Integration

US2 (Stripe Elements) is the highest-risk task. If issues arise with inline payment:
- Fallback option: Use Stripe Checkout Sessions (redirect) as a temporary solution
- The backend create-subscription-intent endpoint still works — only the frontend integration changes

---

## Notes

- No database migrations needed — finishOnboarding field already exists
- Existing Stripe webhook handler processes subscriptions created via Elements the same way as Checkout Sessions
- Cross-subdomain cookies (.fotno.com) ensure session persists from auth app to dashboard
- Regional pricing support carries over from existing billing infrastructure to new subscription intent endpoint
