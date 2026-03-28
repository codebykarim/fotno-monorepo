# Feature Specification: Fix Billing Downgrade & Remove Trial Period

**Feature Branch**: `001-fix-billing-remove-trial`
**Created**: 2026-03-28
**Status**: Ready for Implementation
**Input**: User description: "Fix plan downgrade bug + remove 14-day trial entirely"

## Clarifications

### Session 2026-03-28

- Q: Should downgrades take effect immediately or at end of billing period? → A: End of billing period — user retains current plan benefits until then.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Plan Downgrade Produces Correct Result (Priority: P1)

A photographer on the Professional plan (100 GB) decides the Starter plan
(20 GB) better fits their needs. They navigate to the billing page, select
Starter, and confirm the change. After the billing cycle processes, their
account reflects the Starter plan with the correct storage limit.

**Why this priority**: This is a revenue-impacting bug. Users who attempt to
downgrade are silently kept on a more expensive plan, which erodes trust and
may trigger chargebacks or support complaints.

**Independent Test**: Subscribe to Professional, then switch to Starter.
Verify the account shows Starter plan, Starter storage limit, and the
correct Stripe price after the change takes effect.

**Acceptance Scenarios**:

1. **Given** a user on Professional (100 GB), **When** they switch to
   Starter (20 GB), **Then** their plan updates to Starter with 20 GB
   storage limit at the end of the current billing period.
2. **Given** a user on Business (500 GB), **When** they switch to Starter
   (20 GB), **Then** their plan updates to Starter with 20 GB storage
   limit at the end of the current billing period.
3. **Given** a user on Business (500 GB), **When** they switch to
   Professional (100 GB), **Then** their plan updates to Professional with
   100 GB storage limit at the end of the current billing period.
4. **Given** a user who initiated a downgrade, **When** they view the
   billing page before the period ends, **Then** they see their current
   active plan with an indication that a downgrade is scheduled.
5. **Given** a user on Starter (20 GB), **When** they upgrade to
   Professional (100 GB), **Then** their plan updates to Professional with
   100 GB storage immediately (existing upgrade behavior preserved).
6. **Given** a user on Professional, **When** they downgrade to Starter and
   the billing webhook fires at period end, **Then** the system correctly
   identifies the new plan from the webhook data without falling back to
   the old plan.

---

### User Story 2 - Trial Period Fully Removed (Priority: P1)

A new photographer signs up for Fotno. Instead of receiving a 14-day trial,
they start on the Free tier with the free storage limit. If they want more
storage or features, they subscribe to a paid plan immediately — no trial
countdown, no trial banners, no trial-to-paid conversion flow.

**Why this priority**: The business model is shifting to a free tier with
immediate paid upgrades. The trial period creates confusion and unnecessary
complexity. Removing it simplifies onboarding and billing logic.

**Independent Test**: Create a new account and verify the user starts on the
Free plan with free-tier storage limits. Confirm no trial banners, trial
countdowns, or trial-related messaging appears anywhere in the product.

**Acceptance Scenarios**:

1. **Given** a new user signs up, **When** their account is created,
   **Then** they are placed on the Free plan (not Trial) with the
   free-tier storage limit.
2. **Given** any page in the dashboard, **When** a free-tier user views it,
   **Then** no trial banner, trial countdown, or "trial days remaining"
   messaging is shown.
3. **Given** the landing page, **When** a visitor views call-to-action
   buttons, **Then** the text reads "Get started free" or equivalent — not
   "Start free trial".
4. **Given** the billing page, **When** a free-tier user views their plan
   status, **Then** it shows "Free" — not "Trialing" or "Trial".
5. **Given** the admin panel, **When** an admin filters or views users,
   **Then** "TRIAL" is no longer a valid plan filter option.
6. **Given** a user cancels a paid subscription, **When** the cancellation
   processes, **Then** they revert to Free plan — not Trial.
7. **Given** existing users who are currently on a Trial plan, **When** the
   migration runs, **Then** they are moved to Free plan with free-tier
   storage limits.

---

### Edge Cases

- What happens to users whose `trialEndsAt` date has not yet passed when
  the migration runs? They MUST be moved to Free plan immediately.
- What happens if a user's current storage usage exceeds the free-tier
  limit after trial removal? Their existing data MUST be preserved, but
  they cannot upload more until they upgrade or reduce usage.
- What happens if a downgrade is initiated but the webhook is delayed? The
  system MUST correctly process the change whenever the webhook arrives,
  not fall back to the old plan.
- What happens if a user on Business downgrades to Starter and their
  current storage usage exceeds 20 GB? Existing data MUST be preserved,
  but uploads are blocked until usage is within the new limit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Plan changes (both upgrades and downgrades) MUST result in
  the correct target plan being reflected in the user's account.
- **FR-002**: The subscription webhook handler MUST reliably identify the
  new plan from webhook data without falling back to the current database
  value.
- **FR-003**: The system MUST NOT offer, reference, or enforce a 14-day
  trial period anywhere in the product.
- **FR-004**: New user accounts MUST start on the Free plan with
  free-tier storage limits.
- **FR-005**: The "TRIAL" plan state MUST be removed from the system.
  Existing Trial users MUST be migrated to Free.
- **FR-006**: All user-facing text referencing "trial", "free trial", or
  "trial days" MUST be updated or removed.
- **FR-007**: The admin panel MUST no longer include "TRIAL" as a plan
  filter or display option.
- **FR-008**: Subscription cancellation MUST revert users to Free plan,
  not Trial.
- **FR-009**: The upload service MUST use "FREE" as the default plan
  fallback, not "TRIAL".
- **FR-010**: The `trialEndsAt` field and "trialing" status MUST be
  removed from API responses and frontend type definitions.
- **FR-011**: Downgrades MUST take effect at the end of the current
  billing period. The user MUST retain their current plan's storage
  limit until then.
- **FR-012**: During a pending downgrade, the billing page MUST indicate
  that a plan change is scheduled (e.g., showing the upcoming plan and
  effective date).

### Key Entities *(include if feature involves data)*

- **User**: Owns `plan` (enum: FREE, PRO, EXPIRED — TRIAL removed),
  `trialEndsAt` (field removed), `storageLimit`, `storageTierGb`.
- **Subscription**: Links user to Stripe subscription, tracks plan tier
  and storage allocation.
- **PricingTier**: Defines available plans with storage amounts and Stripe
  price IDs. Used for plan identification during webhooks.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of plan downgrades result in the correct target plan
  being applied — no silent reversions to the previous plan.
- **SC-002**: Zero occurrences of the word "trial" (case-insensitive) in
  any user-facing interface across landing, dashboard, auth, gallery, and
  admin applications.
- **SC-003**: New user accounts are created with Free plan and free-tier
  storage limit with zero exceptions.
- **SC-004**: All existing Trial users are migrated to Free plan after
  deployment.
- **SC-005**: Plan changes (upgrade and downgrade) between all tier
  combinations (Starter ↔ Professional ↔ Business ↔ Unlimited) produce
  correct results.

## Assumptions

- The Free plan already exists in the system and has correct storage
  limits configured in the PricingTier table.
- The `auth.ts` new-user hook already assigns `plan: "FREE"` to new
  signups (confirmed in codebase), so no change is needed for new user
  creation logic.
- Stripe subscription modifications (upgrades and downgrades) will
  continue to use the same Stripe API — only the application-side handling
  changes.
- Existing data for users migrated from Trial to Free will be preserved
  regardless of whether it exceeds the free-tier limit.
- The Prisma migration to remove the TRIAL enum value and trialEndsAt
  field will run automatically on deployment via `prisma migrate deploy`.
