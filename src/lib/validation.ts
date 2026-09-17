import { z } from "zod"

const username = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-z0-9_]+$/,
    "Use only lowercase letters, numbers, and underscores"
  )

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")

export const loginSchema = z.object({ username, password })

export const registerSchema = loginSchema
  .extend({ confirmPassword: z.string() })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const profileSchema = z.object({
  age: z.coerce.number().int().min(13).max(120),
  heightCm: z.coerce.number().min(100).max(250),
  weightKg: z.coerce.number().min(25).max(400),
  recordedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const dailyActivitySchema = z.object({
  steps: z.coerce.number().int().nonnegative().max(200000),
  activityCalories: z.coerce.number().int().nonnegative().max(20000),
})

const optionalNumber = <Schema extends z.ZodType<number, unknown>>(
  schema: Schema
) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    schema.optional()
  )

export const workoutSchema = z
  .object({
    type: z.enum(["STRENGTH", "BODYWEIGHT", "TREADMILL", "CYCLING"]),
    name: z.string().trim().min(2).max(80),
    performedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    weightKg: optionalNumber(z.coerce.number().positive().max(1000)),
    reps: optionalNumber(z.coerce.number().int().positive().max(10000)),
    sets: optionalNumber(z.coerce.number().int().positive().max(1000)),
    durationMinutes: optionalNumber(
      z.coerce.number().positive().max(1440)
    ),
    steps: optionalNumber(z.coerce.number().int().nonnegative().max(200000)),
    calories: optionalNumber(
      z.coerce.number().int().nonnegative().max(20000)
    ),
    distanceKm: optionalNumber(z.coerce.number().positive().max(1000)),
  })
  .superRefine((value, context) => {
    const requireField = (
      key: keyof typeof value,
      message: string
    ) => {
      if (value[key] === undefined) {
        context.addIssue({ code: "custom", path: [key], message })
      }
    }

    if (value.type === "STRENGTH") {
      requireField("weightKg", "Enter the weight used")
      requireField("reps", "Enter the reps")
      requireField("sets", "Enter the sets")
    }

    if (value.type === "BODYWEIGHT") {
      requireField("reps", "Enter the reps")
      requireField("sets", "Enter the sets")
    }

    if (value.type === "TREADMILL" || value.type === "CYCLING") {
      requireField("durationMinutes", "Enter the duration")
      requireField("calories", "Enter calories")
      requireField("distanceKm", "Enter the distance")
    }

    if (value.type === "TREADMILL") {
      requireField("steps", "Enter steps")
    }
  })

export const muscleGroupSchema = z.enum([
  "BACK",
  "LEGS",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "CHEST",
  "CARDIO",
])

const workoutPlanExerciseSchema = z.object({
  clientId: z.string().min(1).max(100),
  completed: z.boolean(),
  muscleGroup: muscleGroupSchema,
  type: z.enum(["STRENGTH", "BODYWEIGHT", "TREADMILL", "CYCLING"]),
  name: z.string().trim().max(80),
  weightKg: z.number().positive().max(1000).nullable(),
  reps: z.number().int().positive().max(10000).nullable(),
  sets: z.number().int().positive().max(1000).nullable(),
  durationMinutes: z.number().positive().max(1440).nullable(),
  steps: z.number().int().nonnegative().max(200000).nullable(),
  calories: z.number().int().nonnegative().max(20000).nullable(),
  distanceKm: z.number().positive().max(1000).nullable(),
})

export const workoutSessionPlanSchema = z
  .object({
    category: z.enum(["STRENGTH", "CARDIO"]),
    performedOn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid workout date"),
    timezoneOffsetMinutes: z.number().int().min(-840).max(840),
    selectedGroups: z.array(muscleGroupSchema).min(1),
    exercises: z.array(workoutPlanExerciseSchema).max(40),
  })
  .superRefine((value, context) => {
    const selected = new Set(value.selectedGroups)
    const checked = value.exercises
      .map((exercise, index) => ({ exercise, index }))
      .filter(({ exercise }) => exercise.completed)

    if (!checked.length) {
      context.addIssue({
        code: "custom",
        path: ["exercises"],
        message: "Check at least one completed exercise before saving",
      })
    }

    if (
      value.category === "CARDIO" &&
      (value.selectedGroups.length !== 1 || value.selectedGroups[0] !== "CARDIO")
    ) {
      context.addIssue({
        code: "custom",
        path: ["selectedGroups"],
        message: "Cardio must be planned separately",
      })
    }

    if (
      value.category === "STRENGTH" &&
      value.selectedGroups.some((group) => group === "CARDIO")
    ) {
      context.addIssue({
        code: "custom",
        path: ["selectedGroups"],
        message: "Choose muscle groups for a strength session",
      })
    }

    for (const { exercise, index } of checked) {
      const path = (field: string) => ["exercises", index, field]
      const issue = (field: string, message: string) =>
        context.addIssue({ code: "custom", path: path(field), message })

      if (!selected.has(exercise.muscleGroup)) {
        issue(
          "muscleGroup",
          "This exercise must belong to a selected training zone"
        )
      }

      if (exercise.name.length < 2) {
        issue("name", "Enter an exercise name")
      }

      if (value.category === "CARDIO") {
        if (
          exercise.muscleGroup !== "CARDIO" ||
          (exercise.type !== "TREADMILL" && exercise.type !== "CYCLING")
        ) {
          issue("type", "Cardio sessions can only contain cardio exercises")
        }
      } else if (
        exercise.muscleGroup === "CARDIO" ||
        (exercise.type !== "STRENGTH" && exercise.type !== "BODYWEIGHT")
      ) {
        issue("type", "Strength sessions can only contain strength exercises")
      }

      if (exercise.type === "STRENGTH") {
        if (exercise.weightKg === null) issue("weightKg", "Enter weight")
        if (exercise.reps === null) issue("reps", "Enter reps")
        if (exercise.sets === null) issue("sets", "Enter sets")
      }

      if (exercise.type === "BODYWEIGHT") {
        if (exercise.reps === null) issue("reps", "Enter reps")
        if (exercise.sets === null) issue("sets", "Enter sets")
      }

      if (exercise.type === "TREADMILL" || exercise.type === "CYCLING") {
        if (exercise.durationMinutes === null) {
          issue("durationMinutes", "Enter duration")
        }
        if (exercise.calories === null) issue("calories", "Enter calories")
        if (exercise.distanceKm === null) issue("distanceKm", "Enter distance")
      }

      if (exercise.type === "TREADMILL" && exercise.steps === null) {
        issue("steps", "Enter steps")
      }
    }
  })

export type WorkoutSessionPlanInput = z.infer<typeof workoutSessionPlanSchema>