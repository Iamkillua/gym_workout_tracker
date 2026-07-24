import { redirect } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { requireUser } from "@/lib/dal"
import { getLatestProfile } from "@/lib/profile"

export default async function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser()
  const profile = await getLatestProfile(user.id)

  if (!profile) {
    redirect("/onboarding")
  }

  return <AppShell username={user.username}>{children}</AppShell>
}