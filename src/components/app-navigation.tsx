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
  { href: "/workouts/new", label: "Plan", icon: PlusIcon },
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
        mobile
          ? "grid grid-cols-4 gap-1 px-2 py-1"
          : "flex flex-col gap-1.5"
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
            data-active={isActive || undefined}
            className={cn(
              "relative flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-all duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              mobile
                ? "h-16 flex-col gap-1 rounded-xl text-[0.68rem]"
                : "min-h-11 justify-start rounded-md px-3",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--sidebar-border)_85%,transparent)]",
              !mobile && "before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0 before:rounded-full before:bg-primary before:transition-all before:duration-150 before:ease-out",
              isActive && !mobile && "before:w-1.5"
            )}
          >
            <Icon className={cn("size-4 transition-transform duration-150", isActive && "scale-105")} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}