"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getDb } from "@/db"
import { workouts } from "@/db/schema"
import { requireUser } from "@/lib/dal"
import { workoutSchema } from "@/lib/validation"
import { calculateAverageSpeed } from "@/lib/workouts"

export type WorkoutFormState = { error: string | null }

const fieldLabels: Record<string, string> = {
  name: "Workout name",
  performedOn: "Date",
  weightKg: "Weight",
  reps: "Reps",
  sets: "Sets",
  durationMinutes: "Duration",
  steps: "Steps",
  calories: "Calories",
  distanceKm: "Distance",
}

export async function saveWorkoutAction(
  _previousState: WorkoutFormState,
  formData: FormData
): Promise<WorkoutFormState> {
  const user = await requireUser()
  const parsed = workoutSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    performedOn: formData.get("performedOn"),
    weightKg: formData.get("weightKg"),
    reps: formData.get("reps"),
    sets: formData.get("sets"),
    durationMinutes: formData.get("durationMinutes"),
    steps: formData.get("steps"),
    calories: formData.get("calories"),
    distanceKm: formData.get("distanceKm"),
  })

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const label = fieldLabels[String(issue.path[0])] ?? "Workout"
    return { error: `${label}: ${issue.message}` }
  }

  const data = parsed.data
  const isCardio = data.type === "TREADMILL" || data.type === "CYCLING"
  const averageSpeedKmh = isCardio
    ? calculateAverageSpeed(data.distanceKm!, data.durationMinutes!)
    : null

  await getDb().insert(workouts).values({
    userId: user.id,
    type: data.type,
    name: data.name,
    performedOn: data.performedOn,
    weightKg: data.type === "STRENGTH" ? data.weightKg : null,
    reps:
      data.type === "STRENGTH" || data.type === "BODYWEIGHT"
        ? data.reps
        : null,
    sets:
      data.type === "STRENGTH" || data.type === "BODYWEIGHT"
        ? data.sets
        : null,
    durationMinutes: isCardio ? data.durationMinutes : null,
    steps: data.type === "TREADMILL" ? data.steps : null,
    calories: isCardio ? data.calories : null,
    distanceKm: isCardio ? data.distanceKm : null,
    averageSpeedKmh,
  })

  revalidatePath("/dashboard")
  revalidatePath("/workouts")
  revalidatePath(`/workouts/history/${encodeURIComponent(data.name)}`)
  redirect("/workouts?added=true")
}