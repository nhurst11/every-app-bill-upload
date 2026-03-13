"use client";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface Bill {
  totalAmount: string | null;
  totalKwh: string | null;
  billingPeriodStart: string | null;
}

const spendingConfig = {
  amount: { label: "Spending", color: "var(--chart-1)" },
} satisfies ChartConfig;

const usageConfig = {
  kwh: { label: "kWh Usage", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function DashboardCharts({ bills }: { bills: Bill[] }) {
  // Only show when 2+ bills have the needed data
  const chartBills = bills
    .filter((b) => b.billingPeriodStart && (b.totalAmount || b.totalKwh))
    .sort(
      (a, b) =>
        new Date(a.billingPeriodStart!).getTime() -
        new Date(b.billingPeriodStart!).getTime()
    );

  if (chartBills.length < 2) return null;

  const data = chartBills.map((b) => ({
    date: new Date(b.billingPeriodStart!).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    amount: b.totalAmount ? Number(b.totalAmount) : 0,
    kwh: b.totalKwh ? Number(b.totalKwh) : 0,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Spending Over Time */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-1">Spending Over Time</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Total bill amount per period
        </p>
        <ChartContainer config={spendingConfig} className="aspect-[2/1] max-h-[220px]">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.08)"
            />
            <XAxis
              dataKey="date"
              stroke="rgba(0,0,0,0.3)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(0,0,0,0.3)"
              fontSize={12}
              tickFormatter={(v) => `$${v}`}
              tickLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#spendGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Energy Usage Over Time */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-1">Energy Usage Over Time</h3>
        <p className="text-sm text-muted-foreground mb-4">
          kWh consumed per period
        </p>
        <ChartContainer config={usageConfig} className="aspect-[2/1] max-h-[220px]">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.08)"
            />
            <XAxis
              dataKey="date"
              stroke="rgba(0,0,0,0.3)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(0,0,0,0.3)"
              fontSize={12}
              tickFormatter={(v) => `${v.toLocaleString()}`}
              tickLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `${Number(value).toLocaleString()} kWh`
                  }
                />
              }
            />
            <Line
              type="monotone"
              dataKey="kwh"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-2)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
