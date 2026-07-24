import { desc, eq } from "drizzle-orm"
import { CheckCircle2Icon, DumbbellIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { getDb } from "@/db"
import { workouts } from "@/db/schema"
import { requireUser } from "@/lib/dal"
import {
  getWorkoutSummary,
  getWorkoutVolume,
  workoutTypeLabels,
} from "@/lib/workouts"

export const metadata = { title: "Workouts" }

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>
}) {
  const user = await requireUser()
  const entries = await getDb()
    .select()
    .from(workouts)
    .where(eq(workouts.userId, user.id))
    .orderBy(desc(workouts.performedOn), desc(workouts.createdAt))
  const { added } = await searchParams
  const groups = entries.reduce((result, entry) => {
    const dayEntries = result.get(entry.performedOn) ?? []
    dayEntries.push(entry)
    result.set(entry.performedOn, dayEntries)
    return result
  }, new Map<string, typeof entries>())
  const totalDistance = entries.reduce(
    (sum, entry) => sum + (entry.distanceKm ?? 0),
    0
  )
  const totalVolume = entries.reduce(
    (sum, entry) =>
      sum + (entry.type === "STRENGTH" ? getWorkoutVolume(entry) : 0),
    0
  )

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Training log</p>
          <h1 className="text-3xl font-semibold">Workouts</h1>
          <p className="mt-1 text-muted-foreground">
            Daily sessions across weights, bodyweight, and cardio.
          </p>
        </div>
        <Link href="/workouts/new" className={buttonVariants({ size: "lg" })}>
          <PlusIcon data-icon="inline-start" />
          Add workout
        </Link>
      </header>

      {added ? (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Workout added</AlertTitle>
          <AlertDescription>The session is now part of your history.</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid grid-cols-3 gap-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Sessions</CardDescription>
            <CardTitle>{entries.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Distance</CardDescription>
            <CardTitle>{totalDistance.toFixed(1)} km</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Load volume</CardDescription>
            <CardTitle>{Math.round(totalVolume).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      {entries.length ? (
        <div className="flex flex-col gap-4">
          {[...groups.entries()].map(([date, dayEntries]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle>
                  {new Intl.DateTimeFormat("en", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(`${date}T12:00:00Z`))}
                </CardTitle>
                <CardDescription>
                  {dayEntries.length} {dayEntries.length === 1 ? "entry" : "entries"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  {dayEntries.map((workout, index) => (
                    <div key={workout.id}>
                      {index ? <Separator /> : null}
                      <Link
                        href={`/workouts/history/${encodeURIComponent(workout.name)}?type=${workout.type}`}
                        className="flex min-h-20 items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{workout.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {getWorkoutSummary(workout)}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {workoutTypeLabels[workout.type]}
                        </Badge>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DumbbellIcon />
            </EmptyMedia>
            <EmptyTitle>No workouts logged</EmptyTitle>
            <EmptyDescription>
              Add your first workout to start a daily training history.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/workouts/new" className={buttonVariants()}>
              Add first workout
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}