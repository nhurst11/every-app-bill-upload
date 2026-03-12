"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold">NJ Bill Analyzer</span>
          <div className="flex gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Log in
            </Link>
            <Link href="/signup" className={cn(buttonVariants())}>
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Understand Your NJ
            <br />
            <span className="text-primary">Commercial Energy Bills</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Upload your utility bills and instantly see what you&apos;re paying,
            how much energy you&apos;re using, and where you can save. Built for
            New Jersey businesses.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Log In
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="container mx-auto px-4 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Upload Bills</CardTitle>
                <CardDescription>
                  Simply upload your commercial energy bills in any format.
                  We&apos;ll extract the key data automatically.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Track Spending</CardTitle>
                <CardDescription>
                  See your energy costs over time. Identify trends and spot
                  unexpected charges on your NJ utility bills.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Save Energy</CardTitle>
                <CardDescription>
                  Get insights into your kWh usage patterns and find
                  opportunities to reduce your commercial energy costs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} NJ Bill Analyzer. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
