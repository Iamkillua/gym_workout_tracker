import type { Workout, WorkoutType } from "@/db/schema"

export const workoutTypeLabels: Record<WorkoutType, string> = {
  STRENGTH: "Weights",
  BODYWEIGHT: "Bodyweight",
  TREADMILL: "Treadmill",
  CYCLING: "Cycling",
}

export function calculateAverageSpeed(
  distanceKm: number,
  durationMinutes: number
) {
  return Math.round((distanceKm / (durationMinutes / 60)) * 100) / 100
}

export function getWorkoutSummary(workout: Workout) {
  if (workout.type === "STRENGTH") {
    return `${workout.weightKg} kg · ${workout.reps} reps · ${workout.sets} sets`
  }

  if (workout.type === "BODYWEIGHT") {
    return `${workout.reps} reps · ${workout.sets} sets`
  }

  const speed = workout.averageSpeedKmh?.toFixed(1) ?? "0.0"
  return `${workout.durationMinutes} min · ${workout.distanceKm} km · ${speed} km/h`
}

export function getWorkoutVolume(workout: Workout) {
  if (workout.type === "STRENGTH") {
    return (workout.weightKg ?? 0) * (workout.reps ?? 0) * (workout.sets ?? 0)
  }

  if (workout.type === "BODYWEIGHT") {
    return (workout.reps ?? 0) * (workout.sets ?? 0)
  }

  return 0
}