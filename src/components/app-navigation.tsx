"use client"

import {
  ChartNoAxesCombinedIcon,
  DumbbellIcon,
  HouseIcon,
  PlusIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const items = [
  { href: "/dashboard", label: "Home", icon: HouseIcon },
  { href: "/workouts", label: "Workouts", icon: DumbbellIcon },
  { href: "/workouts/new", label: "Add", icon: PlusIcon },
  { href: "/progress", label: "Progress", icon: ChartNoAxesCombinedIcon },
]

export function AppNavigation({
  mobile = false,
}: {
  mobile?: boolean
}) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        mobile ? "grid grid-cols-4" : "flex flex-col gap-1"
      )}
    >
      {items.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : item.href === "/workouts"
              ? pathname === "/workouts" || pathname.startsWith("/workouts/history")
              : pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              mobile ? "h-16 flex-col gap-1 text-xs" : "h-10 justify-start rounded-md px-3",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Icon />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}