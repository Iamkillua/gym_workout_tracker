import type { MuscleGroup, Workout } from "@/db/schema"

export const strengthMuscleGroups = [
  "BACK",
  "LEGS",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "CHEST",
] as const satisfies readonly MuscleGroup[]

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  BACK: "Back",
  LEGS: "Legs",
  SHOULDERS: "Shoulders",
  BICEPS: "Biceps",
  TRICEPS: "Triceps",
  CHEST: "Chest",
  CARDIO: "Cardio",
}

export type SuggestedExercise = Pick<
  Workout,
  | "id"
  | "name"
  | "type"
  | "weightKg"
  | "reps"
  | "sets"
  | "durationMinutes"
  | "steps"
  | "calories"
  | "distanceKm"
> & { muscleGroup: MuscleGroup }
  & { sourcePerformedOn: string | null }

export type WorkoutSuggestions = Record<MuscleGroup, SuggestedExercise[]>
