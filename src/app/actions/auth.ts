"use server"

import { compare, hash } from "bcryptjs"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { getDb } from "@/db"
import { users } from "@/db/schema"
import { createSession, deleteSession } from "@/lib/session"
import { loginSchema, registerSchema } from "@/lib/validation"

function hasPostgresCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  )
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    redirect("/login?error=invalid_input")
  }

  const [user] = await getDb()
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.username, parsed.data.username))
    .limit(1)

  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    redirect("/login?error=invalid_credentials")
  }

  await createSession(user.id)
  redirect("/dashboard")
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    const mismatch = parsed.error.issues.some(
      (issue) => issue.path[0] === "confirmPassword"
    )
    redirect(`/register?error=${mismatch ? "password_mismatch" : "invalid_input"}`)
  }

  try {
    const [user] = await getDb()
      .insert(users)
      .values({
        username: parsed.data.username,
        passwordHash: await hash(parsed.data.password, 12),
      })
      .returning({ id: users.id })

    await createSession(user.id)
  } catch (error) {
    if (hasPostgresCode(error, "23505")) {
      redirect("/register?error=username_taken")
    }

    throw error
  }

  redirect("/onboarding")
}

export async function logoutAction() {
  await deleteSession()
  redirect("/login")
}