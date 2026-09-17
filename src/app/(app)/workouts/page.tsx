import {
  CheckCircle2Icon,
  DumbbellIcon,
  PlusIcon,
  Repeat2Icon,
} from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { requireUser } from "@/lib/dal"
import { cn } from "@/lib/utils"
import {
  muscleGroupLabels,
} from "@/lib/workout-planning"
import { getWorkoutTimeline } from "@/lib/workout-sessions"
import {
  getWorkoutSummary,
  workoutTypeLabels,
} from "@/lib/workouts"

export const metadata = { title: "Training log" }

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>
}) {
  const user = await requireUser()
  const [timeline, { added }] = await Promise.all([
    getWorkoutTimeline(user.id),
    searchParams,
  ])
  const exerciseCount = timeline.reduce(
    (total, session) => total + session.exercises.length,
    0
  )

  return (
    <div className="atlas-log-page">
      <header className="atlas-log-header">
        <div>
          <h1>Training log</h1>
          <p>
            {timeline.length} {timeline.length === 1 ? "session" : "sessions"} ·{" "}
            {exerciseCount} recorded exercises
          </p>
        </div>
        <Link href="/workouts/new" className={buttonVariants({ size: "lg" })}>
          <PlusIcon data-icon="inline-start" />
          Plan today&apos;s workout
        </Link>
      </header>

      {added ? (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Session saved</AlertTitle>
          <AlertDescription>
            Every checked exercise is now part of your history.
          </AlertDescription>
        </Alert>
      ) : null}

      {timeline.length ? (
        <div className="atlas-log-stack">
          {timeline.map((session) => {
            const groups = Array.from(
              new Set(
                session.exercises
                  .map((exercise) => exercise.muscleGroup)
                  .filter((group) => group !== null)
              )
            )
            return (
              <article key={session.id} className="atlas-log-session">
                <header>
                  <div>
                    <time dateTime={session.performedOn}>
                      {new Intl.DateTimeFormat("en", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(
                        new Date(`${session.performedOn}T12:00:00Z`)
                      )}
                    </time>
                    <div className="atlas-log-labels">
                      {groups.map((group) => (
                        <Badge key={group} variant="secondary">
                          {muscleGroupLabels[group!]}
                        </Badge>
                      ))}
                      {session.legacy ? (
                        <Badge variant="outline">Legacy entry</Badge>
                      ) : null}
                    </div>
                  </div>
                  {!session.legacy ? (
                    <Link
                      href={`/workouts/new?repeat=${session.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <Repeat2Icon data-icon="inline-start" />
                      Repeat plan
                    </Link>
                  ) : null}
                </header>

                <div className="atlas-log-exercises">
                  {session.exercises.map((workout) => (
                    <Link
                      key={workout.id}
                      href={`/workouts/history/${encodeURIComponent(workout.name)}?type=${workout.type}`}
                    >
                      <div>
                        <strong>{workout.name}</strong>
                        <span>{getWorkoutSummary(workout)}</span>
                      </div>
                      <div className="atlas-log-exercise-meta">
                        <span>
                          {workout.muscleGroup
                            ? muscleGroupLabels[workout.muscleGroup]
                            : "Group not recorded"}
                        </span>
                        <Badge variant="outline">
                          {workoutTypeLabels[workout.type]}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DumbbellIcon />
            </EmptyMedia>
            <EmptyTitle>No sessions recorded</EmptyTitle>
            <EmptyDescription>
              Choose today&apos;s training zones to build your first repeatable
              plan.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/workouts/new"
              className={cn(buttonVariants(), "min-h-11")}
            >
              Plan first workout
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
