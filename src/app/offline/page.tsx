import { CloudOffIcon, DumbbellIcon, RefreshCwIcon } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = { title: "Offline" }

export default function OfflinePage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <DumbbellIcon />
            </span>
            <CloudOffIcon />
          </div>
          <CardTitle>You are offline</CardTitle>
          <CardDescription>
            Gym Track needs a connection to securely load and save your private data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants()}>
            <RefreshCwIcon data-icon="inline-start" />
            Try again
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}