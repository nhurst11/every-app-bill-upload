import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

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
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
              <CardDescription>Across all bills</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">$0.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total kWh</CardTitle>
              <CardDescription>Energy consumed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Bill upload functionality is coming soon! In the next phase,
              you&apos;ll be able to upload your NJ commercial energy bills and
              see detailed analysis here.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
