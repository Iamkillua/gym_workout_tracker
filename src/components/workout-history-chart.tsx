"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type WorkoutChartPoint = {
  date: string
  primary: number
  secondary: number
}

export function WorkoutHistoryChart({
  data,
  primaryLabel,
  secondaryLabel,
}: {
  data: WorkoutChartPoint[]
  primaryLabel: string
  secondaryLabel: string
}) {
  const config = {
    primary: { label: primaryLabel, color: "var(--chart-1)" },
    secondary: { label: secondaryLabel, color: "var(--chart-3)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <LineChart accessibilityLayer data={data} margin={{ left: 0, right: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={24}
          tickFormatter={(value: string) =>
            new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${value}T12:00:00Z`))
          }
        />
        <YAxis yAxisId="primary" hide domain={["auto", "auto"]} />
        <YAxis yAxisId="secondary" hide orientation="right" domain={["auto", "auto"]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          yAxisId="primary"
          type="monotone"
          dataKey="primary"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          yAxisId="secondary"
          type="monotone"
          dataKey="secondary"
          stroke="var(--color-secondary)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  )
}