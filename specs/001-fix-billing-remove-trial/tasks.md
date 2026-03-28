---
description: "Task list for Fix Billing Downgrade & Remove Trial Period"
---

# Tasks: Fix Billing Downgrade & Remove Trial Period

**Input**: Design documents from `/specs/001-fix-billing-remove-trial/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api-changes.md

**Tests**: No automated tests requested (project has no test infrastructure).

**Organization**: Tasks are grouped by user story. US1 (downgrade fix) and US2 (trial removal) share a foundational phase for schema changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo root**: `/Users/karim/KARINITY/CODE/fotno/monorepo/`
- **Schema**: `packages/db/prisma/schema.prisma`
- **Backend**: `apps/backend/src/`
- **Upload service**: `apps/upload-service/src/`
- **Dashboard**: `apps/dashboard/`
- **Landing**: `apps/landing/`
- **Auth**: `apps/auth/`
- **Admin**: `apps/admin/`

---

## Phase 1: Setup

**Purpose**: No new project initialization needed — existing monorepo. This phase covers shared schema changes that both user stories depend on.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema changes that MUST be complete before either user story can be implemented. Both US1 and US2 depend on these changes.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 Update Prisma schema: remove `TRIAL` from `Plan` enum in `packages/db/prisma/schema.prisma`
- [ ] T002 Update Prisma schema: remove `trialEndsAt DateTime?` field from `User` model in `packages/db/prisma/schema.prisma`
- [ ] T003 Update Prisma schema: add `pendingTierGb Int?` and `pendingEffectiveAt DateTime?` fields to `Subscription` model in `packages/db/prisma/schema.prisma`
- [ ] T004 Create Prisma migration that: (1) migrates existing TRIAL users to FREE, (2) drops `trialEndsAt` column, (3) recreates Plan enum without TRIAL, (4) adds pending tier fields to Subscription — run `pnpm db:migrate` from `packages/db/`
- [ ] T005 Regenerate Prisma client by running `pnpm db:generate` and verify no TypeScript compilation errors in `packages/db/src/index.ts`
- [ ] T006 Verify `packages/db/src/seed.ts` does not reference `TRIAL` plan or `trialEndsAt` — update if needed

**Checkpoint**: Schema updated, migration created, Prisma client regenerated. User story implementation can begin.

---

## Phase 3: User Story 1 - Plan Downgrade Fix (Priority: P1) MVP

**Goal**: Fix the bug where plan downgrades silently revert to the previous plan. Add pending downgrade visibility on the billing page.

**Independent Test**: Subscribe to Professional, downgrade to Starter. Verify the billing page shows the pending downgrade and that the webhook correctly applies the new tier at period end.

### Implementation for User Story 1

- [ ] T007 [US1] Fix `changeTier()` in `apps/backend/src/services/SubscriptionServices/updateSubscription.ts`: for downgrades, store `pendingTierGb` and `pendingEffectiveAt` (from Stripe's `currentPeriodEnd`) on the Subscription record instead of skipping the DB update entirely
- [ ] T008 [US1] Fix `handleSubscriptionUpdated()` in `apps/backend/src/services/SubscriptionServices/handleWebhook.ts`: remove silent fallback to `subscription.storageTierGb` when `findTierByPriceId()` fails — log error instead; on successful tier resolution at period end, update `storageTierGb`, `storageLimit`, and clear `pendingTierGb`/`pendingEffectiveAt`
- [ ] T009 [US1] Update `apps/backend/src/controllers/BillingController.ts`: include `pendingDowngrade` object (`tierGb`, `tierLabel`, `effectiveAt`) in the subscription response when `pendingTierGb` is set on the subscription
- [ ] T010 [US1] Update `apps/dashboard/lib/types/api.ts`: add `pendingDowngrade?: { tierGb: number; tierLabel: string; effectiveAt: string } | null` to the subscription type in `SubscriptionResponse`
- [ ] T011 [US1] Update `apps/dashboard/app/billing/page.tsx`: when `subscription.pendingDowngrade` is present, display a notice showing "Switching to {tierLabel} on {effectiveAt date}" below the current plan info

**Checkpoint**: Plan downgrades now correctly store pending tier in DB, webhook reliably resolves the new tier, and billing page shows pending downgrade notice. Test all tier combinations: Pro→Starter, Business→Starter, Business→Pro, Unlimited→any lower.

---

## Phase 4: User Story 2 - Trial Period Removal (Priority: P1)

**Goal**: Remove all references to the 14-day trial period from backend, frontend, and admin. Free tier replaces trial as the entry point.

**Independent Test**: Create a new account — verify Free plan with no trial messaging. Check all apps for zero "trial" references in UI.

### Backend Trial Removal

- [ ] T012 [P] [US2] Remove trial logic from `apps/backend/src/services/SubscriptionServices/resolveUserAccess.ts`: delete `TRIAL_DAYS` constant, `trialEndsAt` select/logic, `isTrialing` calculation, `trialDaysLeft` computation, and `"trialing"` status from `UserAccessStatus` type
- [ ] T013 [P] [US2] Remove trial logic from `apps/backend/src/services/SubscriptionServices/cancelSubscription.ts`: delete trial detection (TRIAL_DAYS constant, trialEndsAt select, isTrialing check, immediate cancel for trialing users), remove `trialEndsAt: null` from user update
- [ ] T014 [P] [US2] Remove trial handling from `apps/backend/src/services/SubscriptionServices/handleWebhook.ts`: delete `trialEnd` extraction from `sub.trial_end`, remove `trialEndsAt` from user update data in `handleSubscriptionCreated`
- [ ] T015 [P] [US2] Remove `trialDaysLeft` from response in `apps/backend/src/controllers/BillingController.ts`
- [ ] T016 [P] [US2] Change default plan from `"TRIAL"` to `"FREE"` in `apps/backend/src/services/DashboardServices/resolveOwnerUserId.ts`
- [ ] T017 [P] [US2] Change default plan from `"TRIAL"` to `"FREE"` in JWT payload in `apps/backend/src/services/DashboardServices/uploadServiceClient.ts`

### Upload Service Trial Removal

- [ ] T018 [P] [US2] Change default plan from `'TRIAL'` to `'FREE'` in `apps/upload-service/src/middleware/auth.middleware.ts`

### Dashboard Trial Removal

- [ ] T019 [P] [US2] Delete `apps/dashboard/components/trial-banner.tsx` entirely
- [ ] T020 [US2] Remove `TrialBanner` import and `<TrialBanner />` usage from `apps/dashboard/app/layout.tsx` (depends on T019)
- [ ] T021 [US2] Remove trial-related UI from `apps/dashboard/app/billing/page.tsx`: delete `"trialing"` status checks, trial badge rendering with `trialDaysLeft`, and trial-specific conditional branches
- [ ] T022 [P] [US2] Update `apps/dashboard/lib/types/api.ts`: remove `"trialing"` from `UserAccessStatus` union, remove `trialEndsAt` and `trialDaysLeft` from `SubscriptionResponse` access type

### Landing & Auth Trial Removal

- [ ] T023 [P] [US2] Change "Start free trial" to "Get started free" in `apps/landing/components/Hero.tsx`
- [ ] T024 [P] [US2] Change "Start free trial" to "Get started free" in `apps/landing/components/CallToAction.tsx`
- [ ] T025 [P] [US2] Update meta description in `apps/auth/app/layout.tsx`: replace "Free trial available." with "Free plan available." or remove the phrase

### Admin Trial Removal

- [ ] T026 [P] [US2] Remove `TRIAL` badge styling from `apps/admin/components/status-badge.tsx`
- [ ] T027 [P] [US2] Replace `"TRIAL"` with `"FREE"` in the PLANS filter array in `apps/admin/components/users-page.tsx`
- [ ] T028 [P] [US2] Remove `TRIAL` color coding (`p.plan === "TRIAL" ? "bg-blue-500" :`) from `apps/admin/components/analytics-page.tsx`

**Checkpoint**: Zero "trial" references remain in user-facing UI. New accounts start on Free plan. Admin panel shows FREE instead of TRIAL. All acceptance scenarios for US2 pass.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and operational tasks.

- [ ] T029 Run `pnpm lint` across the monorepo and fix any lint errors introduced by changes
- [ ] T030 Run `pnpm build` to verify all 8 services compile successfully with the schema changes
- [ ] T031 Verify Stripe Dashboard: check that no product-level trial period is configured on any Stripe price (manual operational step)
- [ ] T032 Run through `quickstart.md` verification scenarios manually to validate all acceptance criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (schema must include pendingTierGb fields).
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion (TRIAL enum value must be removed from schema first).
- **Polish (Phase 5)**: Depends on Phase 3 and Phase 4 completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2. No dependency on US2.
- **User Story 2 (P1)**: Can start after Phase 2. No dependency on US1.
- **US1 and US2 can proceed in parallel** after Phase 2 completes since they modify different files (with the exception of `handleWebhook.ts` and `billing/page.tsx` which are touched by both — coordinate sequentially within those files).

### Within Each User Story

**US1 (sequential — same files with dependencies):**
- T007 (changeTier fix) → T008 (webhook fix) → T009 (controller response)
- T010 (types) can parallel with T007-T009
- T011 (billing page UI) depends on T009 + T010

**US2 (highly parallelizable — different files):**
- T012-T018 (backend + upload service): all [P], different files
- T019 (delete trial-banner) → T020 (remove from layout)
- T021-T028: all [P], different files across different apps

### Parallel Opportunities

**After Phase 2 completes, launch simultaneously:**

Stream A (US1):
```
T007 → T008 → T009 → T011
T010 (parallel with T007-T009)
```

Stream B (US2 — backend):
```
T012, T013, T014, T015, T016, T017, T018 (all parallel)
```

Stream C (US2 — frontend):
```
T019 → T020
T021, T022, T023, T024, T025, T026, T027, T028 (all parallel)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (schema changes)
2. Complete Phase 3: User Story 1 (downgrade fix)
3. **STOP and VALIDATE**: Test downgrades across all tier combinations
4. If downgrade fix is urgent, deploy just US1 changes

### Full Delivery (Both Stories)

1. Complete Phase 2: Foundational → Schema ready
2. Complete Phase 3: US1 (downgrade fix) — sequential, ~5 tasks
3. Complete Phase 4: US2 (trial removal) — highly parallel, ~17 tasks
4. Complete Phase 5: Polish (lint, build, verify)
5. Deploy — migration auto-runs, all changes take effect

### Parallel Execution

With both stories in parallel after Phase 2:
- Stream A: US1 tasks (T007-T011) — sequential within stream
- Stream B+C: US2 tasks (T012-T028) — mostly parallel
- Coordinate on shared files: `handleWebhook.ts` (T008 + T014), `billing/page.tsx` (T011 + T021)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- T019 (delete trial-banner.tsx) must happen before T020 (remove import)
- T007-T008 modify the same service domain — execute sequentially
- `handleWebhook.ts` is touched by both US1 (T008) and US2 (T014) — do T008 first, then T014
- `billing/page.tsx` is touched by both US1 (T011) and US2 (T021) — do T011 first, then T021
- `BillingController.ts` is touched by both US1 (T009) and US2 (T015) — do T009 first, then T015
- `types/api.ts` is touched by both US1 (T010) and US2 (T022) — do T010 first, then T022
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
