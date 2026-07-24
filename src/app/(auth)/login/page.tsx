import { CircleAlertIcon, LogInIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { loginAction } from "@/app/actions/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getSessionUserId } from "@/lib/session"

const errorMessages: Record<string, string> = {
  invalid_input: "Enter a valid username and password.",
  invalid_credentials: "The username or password is incorrect.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await getSessionUserId()) {
    redirect("/dashboard")
  }

  const { error } = await searchParams
  const errorMessage = error ? errorMessages[error] : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue tracking your training.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={loginAction}>
          <FieldGroup>
            {errorMessage ? (
              <Alert variant="destructive">
                <CircleAlertIcon />
                <AlertTitle>Could not sign in</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                minLength={3}
                maxLength={30}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                maxLength={72}
                required
              />
            </Field>
            <Button type="submit" size="lg">
              <LogInIcon data-icon="inline-start" />
              Sign in
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link className="font-medium text-foreground underline" href="/register">
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}