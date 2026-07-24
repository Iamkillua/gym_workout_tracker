import { CircleAlertIcon, DumbbellIcon } from "lucide-react"
import { redirect } from "next/navigation"

import { ProfileForm } from "@/components/profile-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { requireUser } from "@/lib/dal"
import { getLatestProfile } from "@/lib/profile"

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const user = await requireUser()

  if (await getLatestProfile(user.id)) {
    redirect("/dashboard")
  }

  const { error } = await searchParams

  return (
    <main className="min-h-svh px-4 py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <DumbbellIcon />
            </span>
            <div>
              <p className="font-semibold">Gym Track</p>
              <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
            </div>
          </div>
          <ThemeToggle />
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Set your starting point</CardTitle>
            <CardDescription>
              Add your current details to calculate your first BMI data point.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {error ? (
              <Alert variant="destructive">
                <CircleAlertIcon />
                <AlertTitle>Check your details</AlertTitle>
                <AlertDescription>
                  Enter an age from 13-120, height from 100-250 cm, and weight from 25-400 kg.
                </AlertDescription>
              </Alert>
            ) : null}
            <ProfileForm
              initialDate={new Date().toISOString().slice(0, 10)}
              isOnboarding
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}