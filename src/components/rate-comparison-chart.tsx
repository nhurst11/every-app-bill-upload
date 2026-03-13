"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { findUtilityByName, thirdPartySuppliers } from "@/lib/nj-rates";

interface RateComparisonChartProps {
  supplyRatePerKwh: string | null;
  utilityProvider: string | null;
}

const chartConfig = {
  rate: { label: "Rate (¢/kWh)", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function RateComparisonChart({
  supplyRatePerKwh,
  utilityProvider,
}: RateComparisonChartProps) {
  if (!supplyRatePerKwh) {
    return (
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-1">Rate Comparison</h3>
        <p className="text-sm text-muted-foreground">
          No supply rate available to compare
        </p>
      </div>
    );
  }

  const userRate = Number(supplyRatePerKwh);
  const utility = utilityProvider ? findUtilityByName(utilityProvider) : null;

  // Build comparison data
  const data: { name: string; rate: number; fill: string }[] = [
    { name: "Your Rate", rate: userRate, fill: "var(--chart-1)" },
  ];

  if (utility) {
    data.push({
      name: `${utility.name} BGS`,
      rate: utility.supplyRate,
      fill: "var(--chart-2)",
    });
  }

  // Top 3 cheapest suppliers
  const cheapest = [...thirdPartySuppliers]
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3);

  const supplierColors = ["var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  cheapest.forEach((s, i) => {
    data.push({
      name: s.supplier.split(" ").slice(0, 2).join(" "),
      rate: s.rate,
      fill: supplierColors[i],
    });
  });

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-1">Rate Comparison</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Your supply rate vs alternatives (¢/kWh)
      </p>
      <ChartContainer config={chartConfig} className="aspect-[4/3] max-h-[280px]">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            stroke="rgba(0,0,0,0.08)"
          />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}¢`}
            stroke="rgba(0,0,0,0.3)"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            stroke="rgba(0,0,0,0.3)"
            fontSize={11}
            tickLine={false}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${Number(value).toFixed(2)}¢/kWh`}
              />
            }
          />
          <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
