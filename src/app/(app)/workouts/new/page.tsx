import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

import { WorkoutForm } from "@/components/workout-form"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = { title: "Add workout" }

export default function NewWorkoutPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <header>
        <Link
          href="/workouts"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Workouts
        </Link>
        <h1 className="mt-3 text-3xl font-semibold">Add a workout</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a type and record the numbers that matter.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Session entry</CardTitle>
          <CardDescription>
            Your entry is stored against the selected workout date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutForm />
        </CardContent>
      </Card>
    </div>
  )
}