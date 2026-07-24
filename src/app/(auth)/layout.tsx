import { ActivityIcon, DumbbellIcon, TrendingUpIcon } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-svh lg:grid-cols-[minmax(0,1.1fr)_minmax(28rem,0.9fr)]">
      <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary-foreground text-primary">
            <DumbbellIcon />
          </span>
          <span className="text-lg font-semibold">Gym Track</span>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-5 text-sm font-medium uppercase opacity-70">
            Built for the next rep
          </p>
          <h1 className="text-5xl font-semibold leading-tight">
            Your training history, without the noise.
          </h1>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ActivityIcon />
              Daily workout logs
            </div>
            <div className="flex items-center gap-2">
              <TrendingUpIcon />
              Progress over time
            </div>
          </div>
        </div>
      </section>
      <section className="relative flex min-h-svh items-center justify-center p-4 sm:p-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <DumbbellIcon />
            </span>
            <span className="text-lg font-semibold">Gym Track</span>
          </div>
          {children}
        </div>
      </section>
    </main>
  )
}