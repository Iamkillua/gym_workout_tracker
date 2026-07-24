import { CircleAlertIcon, UserPlusIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { registerAction } from "@/app/actions/auth"
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getSessionUserId } from "@/lib/session"

const errorMessages: Record<string, string> = {
  invalid_input: "Check the fields and try again.",
  password_mismatch: "The passwords do not match.",
  username_taken: "That username is already in use.",
}

export default async function RegisterPage({
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
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Start with a username. Your training data stays private to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={registerAction}>
          <FieldGroup>
            {errorMessage ? (
              <Alert variant="destructive">
                <CircleAlertIcon />
                <AlertTitle>Could not create account</AlertTitle>
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
                pattern="[a-z0-9_]+"
                required
              />
              <FieldDescription>
                Lowercase letters, numbers, and underscores only.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
              />
            </Field>
            <Button type="submit" size="lg">
              <UserPlusIcon data-icon="inline-start" />
              Create account
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-foreground underline" href="/login">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}