import { CheckCircle2Icon, DownloadIcon } from "lucide-react"

import { ProfileChart } from "@/components/profile-chart"
import { ProfileForm } from "@/components/profile-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import { getBmiLabel } from "@/lib/bmi"
import { requireUser } from "@/lib/dal"
import { getProfileHistory } from "@/lib/profile"

export const metadata = { title: "Progress" }

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>
}) {
  const user = await requireUser()
  const history = await getProfileHistory(user.id)
  const latest = history.at(-1)!
  const { updated, error } = await searchParams

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Body metrics</p>
          <h1 className="text-3xl font-semibold">Progress</h1>
          <p className="mt-1 text-muted-foreground">
            Weight and BMI across every measurement you save.
          </p>
        </div>
        <a href="/api/export" className={buttonVariants({ variant: "outline" })}>
          <DownloadIcon data-icon="inline-start" />
          Export workouts
        </a>
      </header>

      {updated ? (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Measurement saved</AlertTitle>
          <AlertDescription>Your graph now includes the new point.</AlertDescription>
        </Alert>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not save measurement</AlertTitle>
          <AlertDescription>Check each value and try again.</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Current weight</CardDescription>
            <CardTitle>{latest.weightKg.toFixed(1)} kg</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Current BMI</CardDescription>
            <CardTitle>{latest.bmi.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Height</CardDescription>
            <CardTitle>{latest.heightCm.toFixed(1)} cm</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Measurements</CardDescription>
            <CardTitle>{history.length}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Trend</CardTitle>
          <CardDescription>
            BMI is a general screening measure, not a medical diagnosis.
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">{getBmiLabel(latest.bmi)}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ProfileChart
            data={history.map((entry) => ({
              date: entry.recordedAt.toISOString(),
              weightKg: entry.weightKg,
              bmi: entry.bmi,
            }))}
          />
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Add a measurement</CardTitle>
            <CardDescription>
              Updating never overwrites your previous values.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              initialAge={latest.age}
              initialHeightCm={latest.heightCm}
              initialWeightKg={latest.weightKg}
              initialDate={new Date().toISOString().slice(0, 10)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Measurement history</CardTitle>
            <CardDescription>Every saved weight and calculated BMI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>BMI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...history].reverse().map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                        entry.recordedAt
                      )}
                    </TableCell>
                    <TableCell>{entry.weightKg.toFixed(1)} kg</TableCell>
                    <TableCell>{entry.bmi.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}