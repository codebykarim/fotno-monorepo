# Feature Specification: Onboarding Flow with Stripe Subscription Step

**Feature Branch**: `002-onboarding-stripe-flow`
**Created**: 2026-03-29
**Status**: Draft
**Input**: User description: "Add onboarding flow before dashboard access. When a user clicks Get Started or selects any plan (Free or Paid), trigger an onboarding flow that collects account info and optionally prompts for Stripe subscription/payment setup."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Completes Onboarding with Free Plan (Priority: P1)

A visitor on the landing page clicks "Get Started" or selects the Free plan. They are taken to an onboarding flow where they enter their email, name, and password to create an account. After account creation, they see a Stripe step that offers an optional card entry (no charge). The user skips the card entry and is taken directly to the dashboard on the Free tier.

**Why this priority**: This is the core happy path that every new user will experience. Without this flow working, no user can reach the dashboard. It also covers the most common scenario for a launch-phase product where many users will start on the free tier.

**Independent Test**: Can be fully tested by navigating to the landing page, clicking "Get Started", completing the account form, skipping the Stripe step, and verifying the user lands on the dashboard with Free tier access.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they click "Get Started", **Then** the onboarding flow opens with the account info step.
2. **Given** the user is on the account info step, **When** they enter a valid email, name, and password, **Then** they can proceed to the next step.
3. **Given** the user is on the account info step, **When** they submit incomplete or invalid information, **Then** they see appropriate validation messages and cannot proceed.
4. **Given** the user has completed account info, **When** they reach the Stripe step on the Free plan, **Then** they see an option to add a card (optional) and a prominent "Skip" option.
5. **Given** the user is on the Stripe step with Free plan, **When** they click "Skip", **Then** they are redirected to the dashboard with Free tier access.

---

### User Story 2 - New User Subscribes to a Paid Plan During Onboarding (Priority: P1)

A visitor on the landing page selects a paid plan (e.g., Starter, Professional). They complete the account info step, then see a Stripe subscription step prompting them to subscribe to their selected plan. They complete payment and land on the dashboard with their paid plan active.

**Why this priority**: This is the primary revenue-generating path and a core goal of the onboarding flow. It must work correctly for launch-phase monetization.

**Independent Test**: Can be fully tested by selecting a paid plan from the pricing section, completing account creation, completing payment via Stripe, and verifying the user lands on the dashboard with the correct paid plan active.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they select a paid plan from the pricing section, **Then** the onboarding flow opens with the selected plan context preserved.
2. **Given** the user has completed account info with a paid plan selected, **When** they reach the Stripe step, **Then** they see the subscription prompt for their chosen plan with pricing details.
3. **Given** the user is on the Stripe step with a paid plan, **When** they complete payment, **Then** they are redirected to the dashboard with the paid plan active.
4. **Given** the user is on the Stripe step with a paid plan, **When** they click "Skip", **Then** they are downgraded to the Free tier and redirected to the dashboard.
5. **Given** the user skipped payment during onboarding, **When** they access the dashboard, **Then** they can still upgrade to a paid plan from the billing page at any time.

---

### User Story 3 - Conversion and Funnel Event Tracking (Priority: P2)

Product and marketing teams need visibility into where users drop off in the onboarding funnel. Each significant step in the flow emits a tracking event: when onboarding starts, when each step is completed, when the Stripe step is viewed, when a subscription starts, and when the Stripe step is skipped. These events feed into analytics to measure conversion rates and marketing effectiveness.

**Why this priority**: Critical for launch-phase decision-making, but the onboarding flow itself must work first. Tracking can be layered on after the core flow is functional.

**Independent Test**: Can be tested by walking through the onboarding flow and verifying that each expected tracking event fires at the correct step with the correct metadata.

**Acceptance Scenarios**:

1. **Given** a user begins the onboarding flow, **When** the first step loads, **Then** an `onboarding_started` event is emitted with the selected plan context (free or paid plan name).
2. **Given** a user completes the final onboarding step, **When** they reach the dashboard, **Then** an `onboarding_completed` event is emitted with the outcome (subscribed or free).
3. **Given** a user reaches the Stripe step, **When** the step loads, **Then** a `stripe_step_viewed` event is emitted.
4. **Given** a user completes payment on the Stripe step, **When** payment is confirmed, **Then** a `subscription_started` event is emitted with the plan name.
5. **Given** a user skips the Stripe step, **When** they click skip, **Then** a `subscription_skipped` event is emitted with the originally selected plan.

---

### User Story 4 - Free Plan User Optionally Adds Payment Card (Priority: P3)

A Free plan user reaches the Stripe step and chooses to add their payment card even though no charge will be applied. Their card is saved for future use, making it frictionless to upgrade later. They land on the dashboard on the Free tier with their card on file.

**Why this priority**: Nice-to-have for reducing future upgrade friction, but not essential for the core onboarding experience. Most Free plan users will skip this step.

**Independent Test**: Can be tested by selecting the Free plan, completing account info, entering card details on the Stripe step (verifying no charge), and confirming the card is saved and the user lands on the dashboard on Free tier.

**Acceptance Scenarios**:

1. **Given** a Free plan user is on the Stripe step, **When** they choose to add a card, **Then** they see a card entry form that clearly states no charge will be applied.
2. **Given** a Free plan user enters valid card details, **When** they submit, **Then** the card is saved to their account and they are redirected to the dashboard on the Free tier.
3. **Given** a Free plan user has a card on file from onboarding, **When** they later visit the billing page, **Then** they can upgrade to a paid plan using the saved card.

---

### Edge Cases

- What happens when a user's email is already registered? They should be informed the email is taken and offered the option to sign in instead.
- What happens when a user closes the browser mid-onboarding and returns later? If the account was created, they should be prompted to sign in and resume the Stripe step. If the account was not yet created, they start fresh.
- What happens when Stripe checkout fails or times out? The user should see a clear error message and be able to retry or skip the Stripe step.
- What happens when a user navigates directly to the dashboard URL without completing onboarding? They should be redirected back to the onboarding flow if their account is flagged as onboarding-incomplete.
- What happens when a paid plan user's payment is declined? They should see a clear error, be able to retry with a different card, or skip (falling back to Free tier).
- What happens when an existing user (who already completed onboarding) clicks "Get Started" on the landing page? They should be redirected to the dashboard, not shown the onboarding flow again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present an onboarding flow when a new user clicks "Get Started" or selects any plan on the landing page. For OAuth signups, the system MUST skip the account info step and take the user directly to the Stripe step.
- **FR-002**: System MUST collect email, name, and password as required fields before allowing the user to proceed past the account info step.
- **FR-003**: System MUST validate that the email address is properly formatted and not already registered before proceeding. Email verification is NOT required during onboarding; the system sends a verification email after onboarding for the user to confirm later.
- **FR-004**: System MUST preserve the user's selected plan context (free or specific paid tier) throughout the entire onboarding flow.
- **FR-005**: System MUST display a Stripe subscription step after the account info step is completed. The payment form MUST be embedded inline within the onboarding flow (not a redirect to an external page), so the user remains in context throughout.
- **FR-006**: System MUST allow Free plan users to skip the Stripe step entirely without entering payment information.
- **FR-007**: System MUST allow Free plan users to optionally add a payment card without being charged.
- **FR-008**: System MUST prompt paid plan users to complete a subscription payment on the Stripe step.
- **FR-009**: System MUST allow paid plan users to skip the Stripe step, with their account falling back to the Free tier.
- **FR-010**: System MUST redirect users to the dashboard after onboarding completion (whether they subscribed, added a card, or skipped).
- **FR-011**: System MUST prevent users with incomplete onboarding from accessing the dashboard, redirecting them back to the onboarding flow.
- **FR-012**: System MUST track the following events: `onboarding_started`, `onboarding_completed`, `stripe_step_viewed`, `subscription_started`, `subscription_skipped`.
- **FR-013**: System MUST allow users who skipped payment during onboarding to subscribe later from the dashboard billing page.
- **FR-014**: System MUST skip the onboarding flow for returning users who have already completed it.
- **FR-015**: System MUST support the onboarding flow structure being extensible for future steps (e.g., additional profile questions) between account info and the Stripe step.

### Key Entities

- **Onboarding Session**: Represents a user's progress through the onboarding flow. Tracks selected plan, current step, and completion status.
- **User Account**: Extended with an onboarding completion flag to gate dashboard access. Related to subscription and payment records.
- **Plan Selection**: The user's chosen plan (Free, Starter, Professional, Business, Unlimited) carried through from landing page into the onboarding flow and ultimately to subscription creation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of new users encounter the onboarding flow before reaching the dashboard (no bypass possible).
- **SC-002**: Users can complete the full onboarding flow (account creation through plan selection) in under 3 minutes.
- **SC-003**: At least 80% of users who start onboarding successfully complete it (reach the dashboard).
- **SC-004**: Conversion funnel data is available for every onboarding step, enabling the team to identify and address drop-off points.
- **SC-005**: Users who skip payment during onboarding can successfully subscribe from the dashboard billing page without re-entering account information.
- **SC-006**: Paid plan selection from the landing page results in a higher subscription conversion rate compared to post-dashboard upgrades, validating the onboarding approach.

## Clarifications

### Session 2026-03-29

- Q: Should email verification happen during onboarding or after? → A: No verification during onboarding; users verify later via email reminder. Dashboard is accessible immediately after onboarding completion.
- Q: Should the Stripe payment step redirect to Stripe's hosted checkout or use an embedded form? → A: Embed Stripe Elements inline within the onboarding flow so the user never leaves the page.
- Q: Should OAuth users (Google/GitHub) go through the onboarding flow? → A: Yes, OAuth users enter onboarding but skip the account info step (auto-filled by provider) and go directly to the Stripe step.

## Assumptions

- The existing authentication system (better-auth with email/password, optional OAuth) will be reused for account creation within the onboarding flow.
- The existing Stripe integration and billing endpoints will be leveraged for the subscription step.
- The onboarding flow is for web users only; native mobile onboarding is out of scope.
- The existing `finishOnboarding` flag on user accounts will be used to track onboarding completion status.
- The onboarding flow will be hosted within the existing auth or dashboard application, not as a separate service.
- The existing Rybbit analytics integration will be used for event tracking.
- Plan pricing and structure (Free, Starter, Professional, Business, Unlimited) remain unchanged by this feature.
- The onboarding flow initially includes only two steps (account info + Stripe), with the architecture supporting future additional steps.
- Users who sign up via OAuth (Google/GitHub) enter the onboarding flow but skip the account info step entirely (provider supplies email/name) and land directly on the Stripe step.
