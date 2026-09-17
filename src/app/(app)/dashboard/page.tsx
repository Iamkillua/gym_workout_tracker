import { and, eq } from "drizzle-orm"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  DumbbellIcon,
  Repeat2Icon,
} from "lucide-react"
import Link from "next/link"

import { DailyActivityForm } from "@/components/daily-activity-form"
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
import { Separator } from "@/components/ui/separator"
import { getDb } from "@/db"
import { dailyActivityEntries } from "@/db/schema"
import { getBmiLabel } from "@/lib/bmi"
import { requireUser } from "@/lib/dal"
import { getProfileHistory } from "@/lib/profile"
import { cn } from "@/lib/utils"
import {
  muscleGroupLabels,
} from "@/lib/workout-planning"
import { getWorkoutTimeline } from "@/lib/workout-sessions"

export const metadata = { title: "Dashboard" }

function startOfWeekDate() {
  const date = new Date()
  const day = date.getUTCDay()
  date.setUTCDate(date.getUTCDate() - ((day + 6) % 7))
  return date.toISOString().slice(0, 10)
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ activityUpdated?: string; activityError?: string }>
}) {
  const user = await requireUser()
  const database = getDb()
  const today = new Date().toISOString().slice(0, 10)
  const [profileHistory, timeline, [todayActivity], params] = await Promise.all([
    getProfileHistory(user.id),
    getWorkoutTimeline(user.id),
    database
      .select()
      .from(dailyActivityEntries)
      .where(
        and(
          eq(dailyActivityEntries.userId, user.id),
          eq(dailyActivityEntries.recordedOn, today)
        )
      )
      .limit(1),
    searchParams,
  ])
  const latest = profileHistory.at(-1)!
  const weekStart = startOfWeekDate()
  const weeklySessions = timeline.filter(
    (session) => session.performedOn >= weekStart
  ).length
  const recent = timeline.slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      <section className="atlas-dashboard-lead">
        <div className="atlas-dashboard-copy">
          <p>
            {new Intl.DateTimeFormat("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </p>
          <h1>Where are you training today, {user.username}?</h1>
          <div className="atlas-dashboard-status">
            <span>{weeklySessions} sessions this week</span>
            <span>{latest.weightKg.toFixed(1)} kg latest weight</span>
          </div>
          <Link
            href="/workouts/new"
            className={cn(buttonVariants({ size: "lg" }), "mt-6")}
          >
            <DumbbellIcon data-icon="inline-start" />
            Plan today&apos;s workout
          </Link>
        </div>

        <div className="atlas-repeat-panel">
          <div>
            <span>REGISTERED HISTORY</span>
            <h2>Repeat a recent session</h2>
          </div>
          {recent.length ? (
            <div className="divide-y divide-[#547085]">
              {recent.map((session) => {
                const groups = Array.from(
                  new Set(
                    session.exercises
                      .map((exercise) => exercise.muscleGroup)
                      .filter((group) => group !== null)
                  )
                )
                return (
                  <div key={session.id} className="atlas-repeat-row">
                    <div>
                      <p>
                        {groups.length
                          ? groups
                              .map((group) => muscleGroupLabels[group!])
                              .join(" + ")
                          : session.exercises[0]?.name}
                      </p>
                      <span>
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        }).format(
                          new Date(`${session.performedOn}T12:00:00Z`)
                        )}{" "}
                        · {session.exercises.length}{" "}
                        {session.exercises.length === 1 ? "exercise" : "exercises"}
                      </span>
                    </div>
                    {session.legacy ? (
                      <Badge variant="outline">Legacy</Badge>
                    ) : (
                      <Link
                        href={`/workouts/new?repeat=${session.id}`}
                        className={buttonVariants({
                          variant: "secondary",
                          size: "sm",
                        })}
                      >
                        <Repeat2Icon data-icon="inline-start" />
                        Repeat
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-[#c6d6df]">
              Your first saved session becomes a repeatable plan.
            </p>
          )}
        </div>
      </section>

      {params.activityUpdated ? (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Today&apos;s activity updated</AlertTitle>
          <AlertDescription>Your latest steps and calories are saved.</AlertDescription>
        </Alert>
      ) : null}
      {params.activityError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not update activity</AlertTitle>
          <AlertDescription>Enter valid steps and activity calories.</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s movement</CardTitle>
            <CardDescription>
              Daily steps and activity calories stay separate from training.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyActivityForm
              steps={todayActivity?.steps ?? 0}
              activityCalories={todayActivity?.activityCalories ?? 0}
            />
          </CardContent>
        </Card>

        <section className="atlas-measurement-strip" aria-labelledby="body-status">
          <div>
            <h2 id="body-status">Body history</h2>
            <p>Latest of {profileHistory.length} measurements</p>
          </div>
          <dl>
            <div>
              <dt>Weight</dt>
              <dd>{latest.weightKg.toFixed(1)} kg</dd>
            </div>
            <Separator />
            <div>
              <dt>BMI reference</dt>
              <dd>{getBmiLabel(latest.bmi)}</dd>
            </div>
            <Separator />
            <div>
              <dt>Height</dt>
              <dd>{latest.heightCm.toFixed(1)} cm</dd>
            </div>
          </dl>
          <Link
            href="/progress"
            className={buttonVariants({ variant: "outline" })}
          >
            Review measurements
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </section>
      </section>
    </div>
  )
}
