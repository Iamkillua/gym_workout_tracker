"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getDb } from "@/db"
import { workoutSessions, workouts } from "@/db/schema"
import { requireUser } from "@/lib/dal"
import {
  workoutSessionPlanSchema,
  type WorkoutSessionPlanInput,
} from "@/lib/validation"
import { calculateAverageSpeed } from "@/lib/workouts"

export type WorkoutSessionFormState = {
  message: string | null
  fieldErrors: Record<string, string>
  focusField: string | null
}

function errorState(
  message: string,
  fieldErrors: Record<string, string> = {},
  focusField: string | null = null
): WorkoutSessionFormState {
  return { message, fieldErrors, focusField }
}

function fieldId(path: PropertyKey[]) {
  if (path[0] === "exercises" && typeof path[1] === "number") {
    return `exercise-${path[1]}-${String(path[2] ?? "name")}`
  }

  if (path[0] === "selectedGroups") return "training-zones"
  if (path[0] === "exercises") return "session-plan"
  return String(path[0] ?? "session-plan")
}

function parsePayload(formData: FormData) {
  const payload = formData.get("payload")

  if (typeof payload !== "string") {
    return {
      success: false as const,
      state: errorState(
        "The workout plan could not be read. Refresh and try again.",
        {},
        "session-plan"
      ),
    }
  }

  let input: unknown
  try {
    input = JSON.parse(payload)
  } catch {
    return {
      success: false as const,
      state: errorState(
        "The workout plan could not be read. Refresh and try again.",
        {},
        "session-plan"
      ),
    }
  }

  const parsed = workoutSessionPlanSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const id = fieldId(issue.path)
      fieldErrors[id] ??= issue.message
    }
    const focusField = fieldId(parsed.error.issues[0]?.path ?? [])

    return {
      success: false as const,
      state: errorState(
        "Review the marked fields, then save the session again.",
        fieldErrors,
        focusField
      ),
    }
  }

  const today = new Date(
    Date.now() - parsed.data.timezoneOffsetMinutes * 60_000
  )
    .toISOString()
    .slice(0, 10)
  if (parsed.data.performedOn > today) {
    return {
      success: false as const,
      state: errorState(
        "Workout date cannot be in the future.",
        { performedOn: "Choose today or an earlier date" },
        "performedOn"
      ),
    }
  }

  return { success: true as const, data: parsed.data }
}

function workoutValues(
  sessionId: string,
  userId: string,
  plan: WorkoutSessionPlanInput
) {
  return plan.exercises
    .filter((exercise) => exercise.completed)
    .map((exercise) => {
      const isCardio =
        exercise.type === "TREADMILL" || exercise.type === "CYCLING"
      const isStrength = exercise.type === "STRENGTH"
      const isResistance = isStrength || exercise.type === "BODYWEIGHT"

      return {
        sessionId,
        userId,
        muscleGroup: exercise.muscleGroup,
        type: exercise.type,
        name: exercise.name,
        performedOn: plan.performedOn,
        weightKg: isStrength ? exercise.weightKg : null,
        reps: isResistance ? exercise.reps : null,
        sets: isResistance ? exercise.sets : null,
        durationMinutes: isCardio ? exercise.durationMinutes : null,
        steps: exercise.type === "TREADMILL" ? exercise.steps : null,
        calories: isCardio ? exercise.calories : null,
        distanceKm: isCardio ? exercise.distanceKm : null,
        averageSpeedKmh:
          isCardio &&
          exercise.distanceKm !== null &&
          exercise.durationMinutes !== null
            ? calculateAverageSpeed(
                exercise.distanceKm,
                exercise.durationMinutes
              )
            : null,
      }
    })
}

export async function saveWorkoutSessionAction(
  _previousState: WorkoutSessionFormState,
  formData: FormData
): Promise<WorkoutSessionFormState> {
  const user = await requireUser()
  const parsed = parsePayload(formData)

  if (!parsed.success) return parsed.state

  const plan = parsed.data
  await getDb().transaction(async (transaction) => {
    const [session] = await transaction
      .insert(workoutSessions)
      .values({
        userId: user.id,
        category: plan.category,
        performedOn: plan.performedOn,
      })
      .returning({ id: workoutSessions.id })

    await transaction
      .insert(workouts)
      .values(workoutValues(session.id, user.id, plan))
  })

  revalidatePath("/dashboard")
  revalidatePath("/workouts")
  for (const exercise of plan.exercises.filter((item) => item.completed)) {
    revalidatePath(`/workouts/history/${encodeURIComponent(exercise.name)}`)
  }
  redirect("/workouts?added=true")
}
