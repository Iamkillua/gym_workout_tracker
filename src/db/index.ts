import "server-only"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/db/schema"

type SqlClient = ReturnType<typeof postgres>

const globalForDatabase = globalThis as unknown as {
  workoutTrackerSql?: SqlClient
}

function getSqlClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured")
  }

  const client =
    globalForDatabase.workoutTrackerSql ??
    postgres(connectionString, {
      max: 1,
      prepare: false,
      connect_timeout: 10,
      idle_timeout: 20,
    })

  if (process.env.NODE_ENV !== "production") {
    globalForDatabase.workoutTrackerSql = client
  }

  return client
}

export function getDb() {
  return drizzle(getSqlClient(), { schema })
}