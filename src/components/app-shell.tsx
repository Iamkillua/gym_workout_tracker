import { DownloadIcon, DumbbellIcon, LogOutIcon } from "lucide-react"
import Link from "next/link"

import { logoutAction } from "@/app/actions/auth"
import { AppNavigation } from "@/components/app-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function AppShell({
  username,
  children,
}: {
  username: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="flex h-16 items-center gap-3 px-5">
          <span className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <DumbbellIcon />
          </span>
          <span className="font-semibold">Gym Track</span>
        </div>
        <Separator />
        <div className="flex flex-1 flex-col gap-6 p-3">
          <AppNavigation />
          <a
            href="/api/export"
            className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
          >
            <DownloadIcon data-icon="inline-start" />
            Export CSV
          </a>
        </div>
        <Separator />
        <div className="p-4 text-sm text-muted-foreground">
          Keep showing up. The graph will follow.
        </div>
      </aside>

      <div className="min-w-0 md:col-start-2">
        <header className="sticky top-0 z-20 flex h-[calc(4rem+env(safe-area-inset-top))] items-center justify-between border-b bg-background/75 px-4 pt-[env(safe-area-inset-top)] backdrop-blur md:h-16 md:px-6 md:pt-0">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <DumbbellIcon />
            </span>
            <span className="font-semibold">Gym Track</span>
          </Link>
          <p className="hidden text-sm text-muted-foreground md:block">
            Signed in as <span className="font-medium text-foreground">{username}</span>
          </p>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <form action={logoutAction}>
              <Tooltip>
                <TooltipTrigger
                  render={<Button type="submit" variant="ghost" size="icon" />}
                >
                  <LogOutIcon />
                  <span className="sr-only">Sign out</span>
                </TooltipTrigger>
                <TooltipContent>Sign out</TooltipContent>
              </Tooltip>
            </form>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:p-6 md:pb-10">
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t bg-background/75 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <AppNavigation mobile />
      </div>
    </div>
  )
}