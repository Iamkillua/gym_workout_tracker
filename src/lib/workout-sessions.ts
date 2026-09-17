import "server-only"

import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm"

import { getDb } from "@/db"
import {
  workoutSessions,
  workouts,
  type MuscleGroup,
  type Workout,
  type WorkoutSessionCategory,
} from "@/db/schema"
import type {
  WorkoutSuggestions,
} from "@/lib/workout-planning"

export type WorkoutTimelineSession = {
  id: string
  category: WorkoutSessionCategory | "LEGACY"
  performedOn: string
  createdAt: Date
  legacy: boolean
  exercises: Workout[]
}

function emptySuggestions(): WorkoutSuggestions {
  return {
    BACK: [],
    LEGS: [],
    SHOULDERS: [],
    BICEPS: [],
    TRICEPS: [],
    CHEST: [],
    CARDIO: [],
  }
}

export async function getWorkoutSuggestions(
  userId: string
): Promise<WorkoutSuggestions> {
  const rows = await getDb()
    .select({
      sessionId: workoutSessions.id,
      performedOn: workoutSessions.performedOn,
      muscleGroup: workouts.muscleGroup,
      workout: workouts,
    })
    .from(workoutSessions)
    .innerJoin(
      workouts,
      and(
        eq(workouts.sessionId, workoutSessions.id),
        eq(workouts.userId, userId),
        isNotNull(workouts.muscleGroup)
      )
    )
    .where(eq(workoutSessions.userId, userId))
    .orderBy(
      asc(workouts.muscleGroup),
      desc(workoutSessions.performedOn),
      desc(workoutSessions.createdAt),
      asc(workouts.createdAt)
    )

  const suggestions = emptySuggestions()
  const latestSessionByGroup = new Map<MuscleGroup, string>()

  for (const row of rows) {
    const group = row.muscleGroup
    if (!group) continue

    const latestSessionId = latestSessionByGroup.get(group)
    if (latestSessionId && latestSessionId !== row.sessionId) continue

    latestSessionByGroup.set(group, row.sessionId)
    suggestions[group].push({
      ...row.workout,
      muscleGroup: group,
      sourcePerformedOn: row.performedOn,
    })
  }

  return suggestions
}

export async function getWorkoutSessionSeed(userId: string, sessionId: string) {
  const rows = await getDb()
    .select({
      session: workoutSessions,
      workout: workouts,
    })
    .from(workoutSessions)
    .innerJoin(
      workouts,
      and(
        eq(workouts.sessionId, workoutSessions.id),
        eq(workouts.userId, userId)
      )
    )
    .where(
      and(
        eq(workoutSessions.id, sessionId),
        eq(workoutSessions.userId, userId)
      )
    )
    .orderBy(asc(workouts.createdAt))

  if (!rows.length) return null

  return {
    id: rows[0].session.id,
    category: rows[0].session.category,
    performedOn: rows[0].session.performedOn,
    exercises: rows.map((row) => row.workout),
  }
}

export async function getWorkoutTimeline(
  userId: string
): Promise<WorkoutTimelineSession[]> {
  const [sessionRows, legacyRows] = await Promise.all([
    getDb()
      .select({
        session: workoutSessions,
        workout: workouts,
      })
      .from(workoutSessions)
      .innerJoin(
        workouts,
        and(
          eq(workouts.sessionId, workoutSessions.id),
          eq(workouts.userId, userId)
        )
      )
      .where(eq(workoutSessions.userId, userId))
      .orderBy(
        desc(workoutSessions.performedOn),
        desc(workoutSessions.createdAt),
        asc(workouts.createdAt)
      ),
    getDb()
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userId), isNull(workouts.sessionId)))
      .orderBy(desc(workouts.performedOn), desc(workouts.createdAt)),
  ])

  const grouped = new Map<string, WorkoutTimelineSession>()

  for (const row of sessionRows) {
    const existing = grouped.get(row.session.id)
    if (existing) {
      existing.exercises.push(row.workout)
      continue
    }

    grouped.set(row.session.id, {
      id: row.session.id,
      category: row.session.category,
      performedOn: row.session.performedOn,
      createdAt: row.session.createdAt,
      legacy: false,
      exercises: [row.workout],
    })
  }

  const timeline = [
    ...grouped.values(),
    ...legacyRows.map((workout) => ({
      id: workout.id,
      category: "LEGACY" as const,
      performedOn: workout.performedOn,
      createdAt: workout.createdAt,
      legacy: true,
      exercises: [workout],
    })),
  ]

  return timeline.sort((left, right) => {
    const dateComparison = right.performedOn.localeCompare(left.performedOn)
    if (dateComparison) return dateComparison
    return right.createdAt.getTime() - left.createdAt.getTime()
  })
}
