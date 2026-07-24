"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getDb } from "@/db"
import { profileEntries } from "@/db/schema"
import { calculateBmi } from "@/lib/bmi"
import { requireUser } from "@/lib/dal"
import { profileSchema } from "@/lib/validation"

export async function saveProfileAction(formData: FormData) {
  const user = await requireUser()
  const isOnboarding = formData.get("returnTo") === "onboarding"
  const failurePath = isOnboarding ? "/onboarding" : "/progress"
  const parsed = profileSchema.safeParse({
    age: formData.get("age"),
    heightCm: formData.get("heightCm"),
    weightKg: formData.get("weightKg"),
    recordedOn: formData.get("recordedOn"),
  })

  if (!parsed.success) {
    redirect(`${failurePath}?error=invalid_profile`)
  }

  const { age, heightCm, weightKg, recordedOn } = parsed.data

  await getDb().insert(profileEntries).values({
    userId: user.id,
    age,
    heightCm,
    weightKg,
    bmi: calculateBmi(weightKg, heightCm),
    recordedAt: new Date(`${recordedOn}T12:00:00.000Z`),
  })

  revalidatePath("/dashboard")
  revalidatePath("/progress")
  redirect(isOnboarding ? "/dashboard" : "/progress?updated=true")
}