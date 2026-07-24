"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  weightKg: {
    label: "Weight (kg)",
    color: "var(--chart-1)",
  },
  bmi: {
    label: "BMI",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ProfileChart({
  data,
}: {
  data: Array<{ date: string; weightKg: number; bmi: number }>
}) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
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
            }).format(new Date(value))
          }
        />
        <YAxis yAxisId="weight" hide domain={["dataMin - 2", "dataMax + 2"]} />
        <YAxis yAxisId="bmi" hide orientation="right" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          yAxisId="weight"
          type="monotone"
          dataKey="weightKg"
          stroke="var(--color-weightKg)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          yAxisId="bmi"
          type="monotone"
          dataKey="bmi"
          stroke="var(--color-bmi)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  )
}