import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { bills } from "@/db/schema";
import { eq, sum, count } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Zap, DollarSign, FileText } from "lucide-react";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [stats] = await db
    .select({
      billCount: count(),
      totalSpent: sum(bills.totalAmount),
      totalKwh: sum(bills.totalKwh),
    })
    .from(bills)
    .where(eq(bills.userId, userId));

  const billCount = stats?.billCount ?? 0;
  const totalSpent = stats?.totalSpent ? Number(stats.totalSpent) : 0;
  const totalKwh = stats?.totalKwh ? Number(stats.totalKwh) : 0;

  const userBills = await db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(bills.uploadedAt);

  const serializedBills = userBills.map((bill) => ({
    id: bill.id,
    fileName: bill.fileName,
    utilityProvider: bill.utilityProvider,
    totalAmount: bill.totalAmount,
    totalKwh: bill.totalKwh,
    supplyRatePerKwh: bill.supplyRatePerKwh,
    deliveryCharges: bill.deliveryCharges,
    demandKw: bill.demandKw,
    demandCharges: bill.demandCharges,
    taxesAndFees: bill.taxesAndFees,
    billingPeriodStart: bill.billingPeriodStart?.toISOString() ?? null,
    billingPeriodEnd: bill.billingPeriodEnd?.toISOString() ?? null,
    status: bill.status,
    uploadedAt: bill.uploadedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-grid">
      {/* Dashboard Nav */}
      <header className="border-b border-border backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-accent-color">NJ</span> Bill Analyzer
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button
              variant="outline"
              type="submit"
              className="border-border hover:border-accent-color/30 hover:text-accent-color"
            >
              Log out
            </Button>
          </form>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">
          Welcome, <span className="text-accent-color">{session.user.name || "there"}</span>!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your NJ commercial energy bill dashboard
        </p>

        {/* Stat Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FileText,
              label: "Bills Uploaded",
              description: "Total bills analyzed",
              value: billCount.toString(),
              color: "accent" as const,
            },
            {
              icon: DollarSign,
              label: "Total Spent",
              description: "Across all bills",
              value: `$${totalSpent.toFixed(2)}`,
              color: "alt" as const,
            },
            {
              icon: Zap,
              label: "Total kWh",
              description: "Energy consumed",
              value: totalKwh.toLocaleString(),
              color: "accent" as const,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-6 transition-all hover:border-accent-color/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    stat.color === "accent"
                      ? "bg-accent-color/10 text-accent-color"
                      : "bg-accent-alt/10 text-accent-alt"
                  }`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
              <p className="text-3xl font-bold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Upload + Bills Table */}
        <div className="mt-8">
          <DashboardClient bills={serializedBills} />
        </div>
      </main>
    </div>
  );
}
