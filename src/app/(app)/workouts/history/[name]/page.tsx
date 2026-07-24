import { and, asc, eq } from "drizzle-orm"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { WorkoutHistoryChart } from "@/components/workout-history-chart"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDb } from "@/db"
import { workouts, workoutType, type WorkoutType } from "@/db/schema"
import { requireUser } from "@/lib/dal"
import { getWorkoutVolume, workoutTypeLabels } from "@/lib/workouts"

function isWorkoutType(value: string | undefined): value is WorkoutType {
  return workoutType.enumValues.includes(value as WorkoutType)
}

export default async function WorkoutHistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const user = await requireUser()
  const { name } = await params
  const { type } = await searchParams

  if (!isWorkoutType(type)) {
    notFound()
  }

  const entries = await getDb()
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, user.id),
        eq(workouts.name, name),
        eq(workouts.type, type)
      )
    )
    .orderBy(asc(workouts.performedOn), asc(workouts.createdAt))

  if (!entries.length) {
    notFound()
  }

  const isStrength = type === "STRENGTH"
  const isBodyweight = type === "BODYWEIGHT"
  const primaryLabel = isStrength
    ? "Weight (kg)"
    : isBodyweight
      ? "Total reps"
      : "Average speed (km/h)"
  const secondaryLabel = isStrength
    ? "Volume (kg)"
    : isBodyweight
      ? "Sets"
      : "Distance (km)"
  const chartData = entries.map((entry) => ({
    date: entry.performedOn,
    primary: isStrength
      ? (entry.weightKg ?? 0)
      : isBodyweight
        ? getWorkoutVolume(entry)
        : (entry.averageSpeedKmh ?? 0),
    secondary: isStrength
      ? getWorkoutVolume(entry)
      : isBodyweight
        ? (entry.sets ?? 0)
        : (entry.distanceKm ?? 0),
  }))
  const bestPrimary = Math.max(...chartData.map((point) => point.primary))
  const bestSecondary = Math.max(...chartData.map((point) => point.secondary))

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/workouts"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Workouts
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{name}</h1>
          <Badge variant="secondary">{workoutTypeLabels[type]}</Badge>
        </div>
        <p className="mt-1 text-muted-foreground">
          Date-by-date values for {entries.length} {entries.length === 1 ? "session" : "sessions"}.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Best {primaryLabel.toLowerCase()}</CardDescription>
            <CardTitle>{bestPrimary.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Best {secondaryLabel.toLowerCase()}</CardDescription>
            <CardTitle>{bestSecondary.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Progress trend</CardTitle>
          <CardDescription>Compare the same workout over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutHistoryChart
            data={chartData}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session history</CardTitle>
          <CardDescription>Raw values behind the graph.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {isStrength ? <TableHead>Weight</TableHead> : null}
                {isStrength || isBodyweight ? <TableHead>Reps</TableHead> : null}
                {isStrength || isBodyweight ? <TableHead>Sets</TableHead> : null}
                {!isStrength && !isBodyweight ? <TableHead>Time</TableHead> : null}
                {type === "TREADMILL" ? <TableHead>Steps</TableHead> : null}
                {!isStrength && !isBodyweight ? <TableHead>Calories</TableHead> : null}
                {!isStrength && !isBodyweight ? <TableHead>Distance</TableHead> : null}
                {!isStrength && !isBodyweight ? <TableHead>Avg speed</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...entries].reverse().map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeZone: "UTC",
                    }).format(new Date(`${entry.performedOn}T12:00:00Z`))}
                  </TableCell>
                  {isStrength ? <TableCell>{entry.weightKg} kg</TableCell> : null}
                  {isStrength || isBodyweight ? <TableCell>{entry.reps}</TableCell> : null}
                  {isStrength || isBodyweight ? <TableCell>{entry.sets}</TableCell> : null}
                  {!isStrength && !isBodyweight ? (
                    <TableCell>{entry.durationMinutes} min</TableCell>
                  ) : null}
                  {type === "TREADMILL" ? <TableCell>{entry.steps}</TableCell> : null}
                  {!isStrength && !isBodyweight ? <TableCell>{entry.calories}</TableCell> : null}
                  {!isStrength && !isBodyweight ? <TableCell>{entry.distanceKm} km</TableCell> : null}
                  {!isStrength && !isBodyweight ? (
                    <TableCell>{entry.averageSpeedKmh?.toFixed(2)} km/h</TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}