import { asc, eq } from "drizzle-orm"

import { getDb } from "@/db"
import { workouts } from "@/db/schema"
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

  const workoutEntries = await getDb()
    .select()
    .from(workouts)
    .where(eq(workouts.userId, user.id))
    .orderBy(asc(workouts.performedOn), asc(workouts.createdAt))

  const headers = [
    "date",
    "workout_name",
    "weight_kg",
    "reps",
    "sets",
    "duration_minutes",
    "steps",
    "calories",
    "distance_km",
    "average_speed_kmh",
  ]
  const rows = workoutEntries.map((workout) => [
    workout.performedOn,
    workout.name,
    workout.weightKg,
    workout.reps,
    workout.sets,
    workout.durationMinutes,
    workout.steps,
    workout.calories,
    workout.distanceKm,
    workout.averageSpeedKmh,
  ])
  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
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