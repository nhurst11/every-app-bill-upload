import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { bills } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavingsCard } from "@/components/savings-card";
import { ArrowLeft, Zap, DollarSign, Gauge } from "lucide-react";
import { CostBreakdownChart } from "@/components/cost-breakdown-chart";
import { RateComparisonChart } from "@/components/rate-comparison-chart";
import { BillInsights } from "@/components/bill-insights";

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const [bill] = await db
    .select()
    .from(bills)
    .where(and(eq(bills.id, id), eq(bills.userId, session.user.id)))
    .limit(1);

  if (!bill) {
    notFound();
  }

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString() : "—";

  const formatMoney = (val: string | null) =>
    val ? `$${Number(val).toFixed(2)}` : "—";

  const formatNumber = (val: string | null) =>
    val ? Number(val).toLocaleString() : "—";

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-cyan hover:bg-cyan/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-cyan">NJ</span> Bill Analyzer
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-2xl font-bold">{bill.fileName}</h1>
          <Badge
            variant="outline"
            className={
              bill.status === "analyzed"
                ? "bg-cyan/10 text-cyan border-cyan/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }
          >
            {bill.status}
          </Badge>
        </div>

        {/* Key Metrics Row */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            {
              icon: DollarSign,
              label: "Total Amount",
              value: formatMoney(bill.totalAmount),
              color: "purple",
            },
            {
              icon: Zap,
              label: "Total kWh",
              value: formatNumber(bill.totalKwh),
              color: "cyan",
            },
            {
              icon: Gauge,
              label: "Supply Rate",
              value: bill.supplyRatePerKwh
                ? `${Number(bill.supplyRatePerKwh).toFixed(2)}\u00a2/kWh`
                : "—",
              color: "cyan",
            },
            {
              icon: Zap,
              label: "Peak Demand",
              value: bill.demandKw
                ? `${Number(bill.demandKw).toFixed(1)} kW`
                : "—",
              color: "purple",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <metric.icon
                  className={`h-4 w-4 ${
                    metric.color === "cyan" ? "text-cyan" : "text-purple"
                  }`}
                />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bill Summary */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-1">Bill Summary</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Key information from your bill
            </p>
            <dl className="space-y-4">
              {[
                { label: "Utility Provider", value: bill.utilityProvider ?? "—" },
                { label: "Account Number", value: bill.accountNumber ?? "—" },
                {
                  label: "Billing Period",
                  value: `${formatDate(bill.billingPeriodStart)} – ${formatDate(bill.billingPeriodEnd)}`,
                },
                { label: "Rate Class", value: bill.rateClass ?? "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Cost Breakdown */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-1">Cost Breakdown</h3>
            <p className="text-sm text-muted-foreground mb-5">
              How your charges are split up
            </p>
            <dl className="space-y-4">
              {[
                {
                  label: "Supply Rate",
                  value: bill.supplyRatePerKwh
                    ? `${Number(bill.supplyRatePerKwh).toFixed(2)}\u00a2/kWh`
                    : "—",
                },
                {
                  label: "Supply Cost (est.)",
                  value:
                    bill.supplyRatePerKwh && bill.totalKwh
                      ? `$${((Number(bill.supplyRatePerKwh) * Number(bill.totalKwh)) / 100).toFixed(2)}`
                      : "—",
                },
                { label: "Delivery Charges", value: formatMoney(bill.deliveryCharges) },
                {
                  label: "Demand (kW)",
                  value: bill.demandKw ? `${Number(bill.demandKw).toFixed(1)} kW` : "—",
                },
                { label: "Demand Charges", value: formatMoney(bill.demandCharges) },
                { label: "Taxes & Fees", value: formatMoney(bill.taxesAndFees) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="font-medium tabular-nums">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CostBreakdownChart
            supplyCost={
              bill.supplyRatePerKwh && bill.totalKwh
                ? (Number(bill.supplyRatePerKwh) * Number(bill.totalKwh)) / 100
                : null
            }
            deliveryCharges={bill.deliveryCharges ? Number(bill.deliveryCharges) : null}
            demandCharges={bill.demandCharges ? Number(bill.demandCharges) : null}
            taxesAndFees={bill.taxesAndFees ? Number(bill.taxesAndFees) : null}
          />
          <RateComparisonChart
            supplyRatePerKwh={bill.supplyRatePerKwh}
            utilityProvider={bill.utilityProvider}
          />
        </div>

        {/* Savings Analysis */}
        <div className="mt-6">
          <SavingsCard
            utilityProvider={bill.utilityProvider}
            supplyRatePerKwh={bill.supplyRatePerKwh}
            totalKwh={bill.totalKwh}
          />
        </div>

        {/* AI Insights */}
        {bill.status === "analyzed" && (
          <div className="mt-6">
            <BillInsights
              billId={bill.id}
              cachedInsights={bill.insights}
            />
          </div>
        )}
      </main>
    </div>
  );
}
