import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { bills } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavingsCard } from "@/components/savings-card";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <span className="text-xl font-bold">NJ Bill Analyzer</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-bold">{bill.fileName}</h1>
          <Badge
            variant={bill.status === "analyzed" ? "default" : "destructive"}
          >
            {bill.status}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bill Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
              <CardDescription>Key information from your bill</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Utility Provider</dt>
                  <dd className="font-medium">
                    {bill.utilityProvider ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Account Number</dt>
                  <dd className="font-medium">
                    {bill.accountNumber ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Billing Period</dt>
                  <dd className="font-medium">
                    {formatDate(bill.billingPeriodStart)} &ndash;{" "}
                    {formatDate(bill.billingPeriodEnd)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total Amount</dt>
                  <dd className="text-xl font-bold">
                    {formatMoney(bill.totalAmount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total kWh</dt>
                  <dd className="font-medium">
                    {formatNumber(bill.totalKwh)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Rate Class</dt>
                  <dd className="font-medium">{bill.rateClass ?? "—"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                How your charges are split up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Supply Rate</dt>
                  <dd className="font-medium">
                    {bill.supplyRatePerKwh
                      ? `${Number(bill.supplyRatePerKwh).toFixed(2)}¢/kWh`
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Supply Cost (estimated)
                  </dt>
                  <dd className="font-medium">
                    {bill.supplyRatePerKwh && bill.totalKwh
                      ? `$${(
                          (Number(bill.supplyRatePerKwh) *
                            Number(bill.totalKwh)) /
                          100
                        ).toFixed(2)}`
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery Charges</dt>
                  <dd className="font-medium">
                    {formatMoney(bill.deliveryCharges)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Demand (kW)</dt>
                  <dd className="font-medium">
                    {bill.demandKw
                      ? `${Number(bill.demandKw).toFixed(1)} kW`
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Demand Charges</dt>
                  <dd className="font-medium">
                    {formatMoney(bill.demandCharges)}
                  </dd>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <dt className="text-muted-foreground">Taxes &amp; Fees</dt>
                  <dd className="font-medium">
                    {formatMoney(bill.taxesAndFees)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Savings Analysis */}
        <div className="mt-6">
          <SavingsCard
            utilityProvider={bill.utilityProvider}
            supplyRatePerKwh={bill.supplyRatePerKwh}
            totalKwh={bill.totalKwh}
          />
        </div>
      </main>
    </div>
  );
}
