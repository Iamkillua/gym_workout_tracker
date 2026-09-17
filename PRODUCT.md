# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is a solo gym-goer using a mobile-first interface while actively working out. Their job is to choose the focus of the day, follow a familiar plan without reconstructing it from memory, record what they actually completed, and preserve an accurate history with minimal interruption between exercises.

## Product Purpose

Gym Track helps an individual record workouts, body measurements, daily steps and activity calories, review progress charts, and export workout history as CSV. Its core workout-planning flow lets the user select one or more muscle groups, receive a suggested plan based on their own recent history, adjust achieved values during the workout, and save all checked exercises together as one workout session for that day.

Success means the user can log a real workout quickly and confidently on a phone while retaining a trustworthy, user-scoped history for later progress review.

## Positioning

Gym Track turns the user's own latest exercise history into an immediately editable plan for the muscle groups they choose. Rather than asking the user to remember and recreate a routine one exercise at a time, it brings forward the most recent exercises and last recorded values, then keeps the user in control of what is completed and saved.

## Operating Context

The product is used during a gym session, primarily on a phone and often in short interactions between sets. The user selects one or more muscle groups from back, legs, shoulders, biceps, triceps, and chest, or chooses cardio as a separate category. Every exercise in the resulting session belongs to one selected muscle group or to cardio.

For each selected muscle group, the suggested plan reuses the most recent exercises and their last recorded values. The user checks exercises as completed, edits the values they actually achieved, and saves all checked exercises together as one workout session for the selected day. The surrounding product also supports periodic body measurements, daily activity entry, progress review, and workout data export.

## Capabilities and Constraints

- Preserve private authentication and strict user scoping for all profile, activity, workout, history, suggestion, and export data.
- Preserve PostgreSQL and Drizzle ORM as the persistence layer and Next.js App Router as the application architecture.
- Preserve installable PWA behavior, the offline fallback, and the rule that authenticated pages and API responses are not stored in the service-worker cache.
- Continue supporting body measurements and BMI history, daily steps and activity calories, workout progress charts, and user-scoped CSV exports.
- Treat back, legs, shoulders, biceps, triceps, and chest as selectable muscle groups. Cardio is a separate category, not a muscle group.
- Allow one or more muscle groups to be selected for a workout plan. Every exercise in a session must be associated with one selected muscle group or with cardio.
- Build suggestions from the user's most recent exercises and last recorded values for each selected muscle group.
- Save all checked exercises as one dated workout session; unchecked exercises are not part of the saved session.
- Let the user edit achieved values before saving. Suggested values are starting points, not authoritative results.

## Brand Commitments

The product name is **Gym Track**. Preserve the product's direct, practical language and avoid unsupported health outcomes, performance promises, testimonials, customer claims, or benchmarks.

## Evidence on Hand

- `README.md` identifies Gym Track as a mobile-first workout tracker and documents private accounts, body measurements and BMI trends, daily activity, workout logging, progress charts, CSV export, the PostgreSQL/Drizzle/Next.js stack, and PWA behavior.
- `package.json` confirms Next.js, React, Drizzle ORM, PostgreSQL, Recharts, Tailwind CSS, and the existing validation commands.
- `src/db/schema.ts` contains user-owned profile, daily activity, and workout records and indexes those records by user and date.
- `src/lib/dal.ts` resolves the signed-in user and redirects unauthenticated access, while `src/app/actions/workouts.ts` and `src/app/actions/daily-activity.ts` associate writes with that user.
- `src/components/workout-form.tsx` demonstrates the current mobile-oriented, labeled workout-entry flow and its strength, bodyweight, and cardio metrics.
- `src/app/(app)/progress/page.tsx` presents body-measurement history and progress charts, and `src/app/api/export/route.ts` exports only the current user's workout records as CSV.
- `src/app/manifest.ts`, `public/sw.js`, and `next.config.ts` provide the installable, portrait-oriented PWA behavior, offline support, and service-worker boundaries.
- The repository contains no testimonials, customer stories, outcome claims, or benchmark evidence. Future product and design work must not fabricate them.

## Product Principles

1. **Make in-workout logging fast.** Minimize taps, typing, and context switching during the short windows between sets.
2. **Favor recognition over recall.** Bring forward familiar exercises and the user's last values instead of requiring routine reconstruction from memory.
3. **Protect a trustworthy progress history.** Clearly distinguish suggestions from achieved results and save only what the user confirms.
4. **Design for mobile ergonomics.** Keep primary choices, completion controls, value editing, and save actions easy to scan and operate one-handed.
5. **Keep the user in control.** Suggestions accelerate the workflow, but the user decides muscle groups, completed exercises, achieved values, date, and what is saved.

## Accessibility & Inclusion

Accessibility is a durable requirement. Preserve semantic structure, explicit form labels, keyboard operation, visible focus, sufficient target sizes, clear validation, and status messaging that does not rely on color alone. The mobile-first workflow must remain usable without requiring precise pointer input or relying solely on gestures.
