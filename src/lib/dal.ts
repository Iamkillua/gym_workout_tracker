import "server-only"

import { cache } from "react"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { getDb } from "@/db"
import { users } from "@/db/schema"
import { getSessionUserId } from "@/lib/session"

export const getCurrentUser = cache(async () => {
  const userId = await getSessionUserId()

  if (!userId) {
    return null
  }

  const [user] = await getDb()
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  return user ?? null
})

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}