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