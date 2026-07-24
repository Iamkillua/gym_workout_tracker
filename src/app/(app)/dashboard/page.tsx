import { and, count, desc, eq, gte } from "drizzle-orm"
import { ArrowRightIcon, DumbbellIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { getBmiLabel } from "@/lib/bmi"
import { requireUser } from "@/lib/dal"
import { getProfileHistory } from "@/lib/profile"
import { cn } from "@/lib/utils"

export const metadata = { title: "Dashboard" }

function startOfWeekDate() {
  const date = new Date()
  const day = date.getUTCDay()
  date.setUTCDate(date.getUTCDate() - ((day + 6) % 7))
  return date.toISOString().slice(0, 10)
}

export default async function DashboardPage() {
  const user = await requireUser()
  const profileHistory = await getProfileHistory(user.id)
  const latest = profileHistory.at(-1)!
  const database = getDb()
  const [[weekly], recent] = await Promise.all([
    database
      .select({ total: count() })
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, user.id),
          gte(workouts.performedOn, startOfWeekDate())
        )
      ),
    database
      .select()
      .from(workouts)
      .where(eq(workouts.userId, user.id))
      .orderBy(desc(workouts.performedOn), desc(workouts.createdAt))
      .limit(4),
  ])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            {new Intl.DateTimeFormat("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </p>
          <h1 className="text-3xl font-semibold">Ready, {user.username}?</h1>
          <p className="mt-1 text-muted-foreground">
            Log the work. Let the trend tell the story.
          </p>
        </div>
        <Link
          href="/workouts/new"
          className={buttonVariants({ size: "lg" })}
        >
          <PlusIcon data-icon="inline-start" />
          Add workout
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Weight</CardDescription>
            <CardTitle>{latest.weightKg.toFixed(1)} kg</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>BMI</CardDescription>
            <CardTitle>{latest.bmi.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>This week</CardDescription>
            <CardTitle>{weekly.total} sessions</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Measurements</CardDescription>
            <CardTitle>{profileHistory.length} logged</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Recent training</CardTitle>
            <CardDescription>Your latest daily workout entries.</CardDescription>
            <CardAction>
              <Link
                href="/workouts"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                View all
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recent.length ? (
              <div className="flex flex-col">
                {recent.map((workout, index) => (
                  <div key={workout.id}>
                    {index ? <Separator /> : null}
                    <Link
                      href={`/workouts/history/${encodeURIComponent(workout.name)}?type=${workout.type}`}
                      className="flex min-h-16 items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                            timeZone: "UTC",
                          }).format(new Date(`${workout.performedOn}T12:00:00Z`))}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {workout.type.toLowerCase()}
                      </Badge>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <DumbbellIcon />
                  </EmptyMedia>
                  <EmptyTitle>No workouts yet</EmptyTitle>
                  <EmptyDescription>
                    Your first session will appear here.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Link href="/workouts/new" className={buttonVariants()}>
                    Add first workout
                  </Link>
                </EmptyContent>
              </Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current snapshot</CardTitle>
            <CardDescription>Based on your latest measurement.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">BMI reference</p>
              <p className="mt-1 font-medium">{getBmiLabel(latest.bmi)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="mt-1 font-medium">{latest.heightCm.toFixed(1)} cm</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="mt-1 font-medium">{latest.age} years</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/progress" className={buttonVariants({ variant: "outline" })}>
              Update measurements
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}