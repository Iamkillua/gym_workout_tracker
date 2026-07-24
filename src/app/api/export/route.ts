import { asc, eq } from "drizzle-orm"

import { getDb } from "@/db"
import { profileEntries, workouts } from "@/db/schema"
import { getCurrentUser } from "@/lib/dal"

export const runtime = "nodejs"

function csvCell(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ""

  let text = String(value)
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const database = getDb()
  const [profiles, workoutEntries] = await Promise.all([
    database
      .select()
      .from(profileEntries)
      .where(eq(profileEntries.userId, user.id))
      .orderBy(asc(profileEntries.recordedAt)),
    database
      .select()
      .from(workouts)
      .where(eq(workouts.userId, user.id))
      .orderBy(asc(workouts.performedOn), asc(workouts.createdAt)),
  ])

  const headers = [
    "record_type",
    "date",
    "username",
    "age",
    "height_cm",
    "profile_weight_kg",
    "bmi",
    "workout_type",
    "workout_name",
    "workout_weight_kg",
    "reps",
    "sets",
    "duration_minutes",
    "steps",
    "calories",
    "distance_km",
    "average_speed_kmh",
  ]
  const rows = [
    ...profiles.map((profile) => ({
      date: profile.recordedAt.toISOString().slice(0, 10),
      values: [
        "profile",
        profile.recordedAt.toISOString().slice(0, 10),
        user.username,
        profile.age,
        profile.heightCm,
        profile.weightKg,
        profile.bmi,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    })),
    ...workoutEntries.map((workout) => ({
      date: workout.performedOn,
      values: [
        "workout",
        workout.performedOn,
        user.username,
        null,
        null,
        null,
        null,
        workout.type,
        workout.name,
        workout.weightKg,
        workout.reps,
        workout.sets,
        workout.durationMinutes,
        workout.steps,
        workout.calories,
        workout.distanceKm,
        workout.averageSpeedKmh,
      ],
    })),
  ].sort((left, right) => left.date.localeCompare(right.date))
  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.values.map(csvCell).join(",")),
  ].join("\r\n")
  const today = new Date().toISOString().slice(0, 10)

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gym-track-${today}.csv"`,
      "Cache-Control": "private, no-store",
    },
  })
}