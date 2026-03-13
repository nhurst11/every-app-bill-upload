"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface CostBreakdownChartProps {
  supplyCost: number | null;
  deliveryCharges: number | null;
  demandCharges: number | null;
  taxesAndFees: number | null;
}

const chartConfig = {
  supply: { label: "Supply Cost", color: "var(--chart-1)" },
  delivery: { label: "Delivery", color: "var(--chart-2)" },
  demand: { label: "Demand", color: "var(--chart-3)" },
  taxes: { label: "Taxes & Fees", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function CostBreakdownChart({
  supplyCost,
  deliveryCharges,
  demandCharges,
  taxesAndFees,
}: CostBreakdownChartProps) {
  const segments = [
    { name: "supply", value: supplyCost },
    { name: "delivery", value: deliveryCharges },
    { name: "demand", value: demandCharges },
    { name: "taxes", value: taxesAndFees },
  ].filter((s) => s.value != null && s.value > 0) as {
    name: string;
    value: number;
  }[];

  if (segments.length === 0) {
    return (
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-1">Cost Breakdown</h3>
        <p className="text-sm text-muted-foreground">
          Not enough data to display chart
        </p>
      </div>
    );
  }

  const colors = segments.map(
    (s) => chartConfig[s.name as keyof typeof chartConfig].color
  );

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-1">Cost Breakdown</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Where your money goes
      </p>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `$${Number(value).toFixed(2)}`}
              />
            }
          />
          <Pie
            data={segments}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            strokeWidth={2}
            stroke="rgba(26, 26, 26, 0.8)"
          >
            {segments.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {segments.map((s) => {
          const cfg = chartConfig[s.name as keyof typeof chartConfig];
          const pct = ((s.value / total) * 100).toFixed(0);
          return (
            <div key={s.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: cfg.color }}
              />
              <span className="text-muted-foreground">{cfg.label}</span>
              <span className="ml-auto font-medium tabular-nums">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
