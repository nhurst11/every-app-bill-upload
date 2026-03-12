import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { bills } from "@/db/schema";
import { eq, sum, count } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch stats from the database
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

  // Fetch bills list
  const userBills = await db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(bills.uploadedAt);

  // Serialize for client component
  const serializedBills = userBills.map((bill) => ({
    id: bill.id,
    fileName: bill.fileName,
    utilityProvider: bill.utilityProvider,
    totalAmount: bill.totalAmount,
    totalKwh: bill.totalKwh,
    status: bill.status,
    uploadedAt: bill.uploadedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen">
      {/* Dashboard Nav */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold">NJ Bill Analyzer</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button variant="outline" type="submit">
              Log out
            </Button>
          </form>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">
          Welcome, {session.user.name || "there"}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your NJ commercial energy bill dashboard
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Bills Uploaded</CardTitle>
              <CardDescription>Total bills analyzed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{billCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
              <CardDescription>Across all bills</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                ${totalSpent.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total kWh</CardTitle>
              <CardDescription>Energy consumed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {totalKwh.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload + Bills Table (client component for interactivity) */}
        <div className="mt-8">
          <DashboardClient bills={serializedBills} />
        </div>
      </main>
    </div>
  );
}
