"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getDb } from "@/db"
import { dailyActivityEntries } from "@/db/schema"
import { requireUser } from "@/lib/dal"
import { dailyActivitySchema } from "@/lib/validation"

export async function saveDailyActivityAction(formData: FormData) {
  const user = await requireUser()
  const parsed = dailyActivitySchema.safeParse({
    steps: formData.get("steps"),
    activityCalories: formData.get("activityCalories"),
  })

  if (!parsed.success) {
    redirect("/dashboard?activityError=invalid")
  }

  const recordedOn = new Date().toISOString().slice(0, 10)
  const { steps, activityCalories } = parsed.data

  await getDb()
    .insert(dailyActivityEntries)
    .values({
      userId: user.id,
      recordedOn,
      steps,
      activityCalories,
    })
    .onConflictDoUpdate({
      target: [dailyActivityEntries.userId, dailyActivityEntries.recordedOn],
      set: {
        steps,
        activityCalories,
        updatedAt: new Date(),
      },
    })

  revalidatePath("/dashboard")
  redirect("/dashboard?activityUpdated=true")
}