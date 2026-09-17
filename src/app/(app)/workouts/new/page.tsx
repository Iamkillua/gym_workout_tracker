import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

import {
  WorkoutForm,
  type RepeatWorkoutPlan,
} from "@/components/workout-form"
import { buttonVariants } from "@/components/ui/button"
import { requireUser } from "@/lib/dal"
import {
  getWorkoutSessionSeed,
  getWorkoutSuggestions,
} from "@/lib/workout-sessions"
import type { SuggestedExercise } from "@/lib/workout-planning"

export const metadata = { title: "Plan today’s workout" }

const directionContract = `<!--
THESIS: The body is the plan; refuse the interchangeable KPI-card dashboard.
OWN-WORLD: Deep ink/navy and mineral-white surfaces; oxygen teal for active/recovered states; coral only for effort/attention. Laminated sports-medicine anatomy plates, precise muscle-zone contours, and dry-erase coaching marks. Restrained strategy—large neutral fields with one primary accent and one semantic effort color.
STORY: Select the body zones training today, recognize the last routine, record actual performance, save one trustworthy session.
FIRST VIEWPORT: On phone, a compact body-zone selector owns the top, the selected-zone plan follows immediately, and the primary session action remains thumb-reachable. On desktop, selector and plan share a purposeful split view.
FORM: Anatomy Training Atlas, grounded direction #3; staging is a finished surface over a registered x-ray/history layer; seed 5052402e.
-->`

function isUuid(value: string | undefined) {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
      )
  )
}

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ repeat?: string }>
}) {
  const user = await requireUser()
  const { repeat } = await searchParams
  const [suggestions, repeated] = await Promise.all([
    getWorkoutSuggestions(user.id),
    isUuid(repeat) ? getWorkoutSessionSeed(user.id, repeat!) : null,
  ])
  const repeatPlan: RepeatWorkoutPlan | null = repeated
    ? {
        id: repeated.id,
        category: repeated.category,
        performedOn: repeated.performedOn,
        exercises: repeated.exercises
          .filter(
            (
              exercise
            ): exercise is typeof exercise & {
              muscleGroup: NonNullable<typeof exercise.muscleGroup>
            } => exercise.muscleGroup !== null
          )
          .map(
            (exercise): SuggestedExercise => ({
              id: exercise.id,
              name: exercise.name,
              type: exercise.type,
              muscleGroup: exercise.muscleGroup,
              weightKg: exercise.weightKg,
              reps: exercise.reps,
              sets: exercise.sets,
              durationMinutes: exercise.durationMinutes,
              steps: exercise.steps,
              calories: exercise.calories,
              distanceKm: exercise.distanceKm,
              sourcePerformedOn: repeated.performedOn,
            })
          ),
      }
    : null

  return (
    <>
      <div
        className="hidden"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: directionContract }}
      />
      <div className="atlas-page">
        <header className="atlas-page-header">
          <Link
            href="/workouts"
            className={buttonVariants({ variant: "ghost" })}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Training log
          </Link>
          <div>
            <h1>Plan today&apos;s workout</h1>
            <p>
              Select the zones. Recall the last work. Record only what happened.
            </p>
          </div>
        </header>
        <WorkoutForm suggestions={suggestions} repeatPlan={repeatPlan} />
      </div>
    </>
  )
}
