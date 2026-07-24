import { sql } from "drizzle-orm"
import {
  date,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const workoutType = pgEnum("workout_type", [
  "STRENGTH",
  "BODYWEIGHT",
  "TREADMILL",
  "CYCLING",
])

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 30 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("users_username_idx").on(table.username)]
)

export const profileEntries = pgTable(
  "profile_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    age: integer("age").notNull(),
    heightCm: doublePrecision("height_cm").notNull(),
    weightKg: doublePrecision("weight_kg").notNull(),
    bmi: doublePrecision("bmi").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("profile_entries_user_date_idx").on(
      table.userId,
      table.recordedAt
    ),
  ]
)

export const dailyActivityEntries = pgTable(
  "daily_activity_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recordedOn: date("recorded_on")
      .default(sql`CURRENT_DATE`)
      .notNull(),
    steps: integer("steps").default(0).notNull(),
    activityCalories: integer("activity_calories").default(0).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("daily_activity_entries_user_date_idx").on(
      table.userId,
      table.recordedOn
    ),
  ]
)

export const workouts = pgTable(
  "workouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: workoutType("type").notNull(),
    name: varchar("name", { length: 80 }).notNull(),
    performedOn: date("performed_on")
      .default(sql`CURRENT_DATE`)
      .notNull(),
    weightKg: doublePrecision("weight_kg"),
    reps: integer("reps"),
    sets: integer("sets"),
    durationMinutes: doublePrecision("duration_minutes"),
    steps: integer("steps"),
    calories: integer("calories"),
    distanceKm: doublePrecision("distance_km"),
    averageSpeedKmh: doublePrecision("average_speed_kmh"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("workouts_user_date_idx").on(table.userId, table.performedOn),
    index("workouts_user_name_type_idx").on(
      table.userId,
      table.name,
      table.type
    ),
  ]
)

export type WorkoutType = (typeof workoutType.enumValues)[number]
export type Workout = typeof workouts.$inferSelect
export type ProfileEntry = typeof profileEntries.$inferSelect
export type DailyActivityEntry = typeof dailyActivityEntries.$inferSelect