import "server-only"

import { asc, desc, eq } from "drizzle-orm"

import { getDb } from "@/db"
import { profileEntries } from "@/db/schema"

export async function getLatestProfile(userId: string) {
  const [profile] = await getDb()
    .select()
    .from(profileEntries)
    .where(eq(profileEntries.userId, userId))
    .orderBy(desc(profileEntries.recordedAt))
    .limit(1)

  return profile ?? null
}

export function getProfileHistory(userId: string) {
  return getDb()
    .select()
    .from(profileEntries)
    .where(eq(profileEntries.userId, userId))
    .orderBy(asc(profileEntries.recordedAt))
}