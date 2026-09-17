---
version: 1
slug: "src-app-app-workouts-new-page-tsx"
primary_target: "src/app/(app)/workouts/new/page.tsx"
related_targets: ["src/components/workout-form.tsx"]
---

## Scope and mode

Primary target: `src/app/(app)/workouts/new/page.tsx`
Mode: Operate, mobile first.

## Audience and job

A solo gym-goer plans and records a workout on a phone between sets. They must choose Strength or Cardio, select valid training zones, recognize the last routine, correct actual values, mark completed exercises, and save one trustworthy dated session.

## Content and constraints

Show only user-scoped historical suggestions. Strength supports BACK, LEGS, SHOULDERS, BICEPS, TRICEPS, and CHEST as a multi-select; Cardio remains separate. Empty history leads directly to adding a custom exercise, never an invented library. Preserve metric types, form state on validation errors, semantic fieldsets, inline linked errors, keyboard access, 44–48px targets, reduced motion, and a thumb-reachable final action.

## Chosen direction

Anatomy Training Atlas: deep ink/navy and mineral-white fields, oxygen teal for active/recovered state, and coral only for effort or attention. The selector behaves like a labeled sports-medicine zone plate; selected zones visibly register into the editable plan below.

## Memorable moment

Choosing a muscle zone draws a restrained coaching trace into the plan, revealing that zone's latest routine without displacing the user's current work.

## Unresolved decisions

None.
