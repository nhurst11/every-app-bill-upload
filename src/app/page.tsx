"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FileText, BarChart3, Zap, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleCallModal } from "@/components/schedule-call-modal";
import { PriceTicker } from "@/components/price-ticker";

export default function Home() {
  const [callModalOpen, setCallModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      {/* Nav */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-cyan">NJ</span> Bill Analyzer
          </span>
          <div className="flex gap-2">
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-muted-foreground hover:text-cyan"
              )}
            >
              Blog
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-muted-foreground hover:text-cyan"
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants(),
                "bg-cyan text-[#0B0F19] hover:bg-cyan/80 font-medium"
              )}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Real-time price ticker */}
      <PriceTicker />

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-32 text-center">
          {/* Decorative orb */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-32 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-cyan/5 blur-[120px]" />
            <div className="absolute right-1/4 top-48 h-[300px] w-[300px] rounded-full bg-purple/5 blur-[100px]" />
          </div>

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 text-sm text-cyan">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Bill Analysis
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
              Understand Your NJ
              <br />
              <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent text-glow-cyan">
                Energy Bills
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Upload your utility bills and instantly see what you&apos;re paying,
              how much energy you&apos;re using, and where you can save. Built for
              New Jersey businesses.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-cyan text-[#0B0F19] hover:bg-cyan/80 font-semibold shadow-[0_0_30px_rgba(6,245,214,0.3)]"
                )}
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/10 hover:border-cyan/30 hover:text-cyan"
                )}
              >
                Log In
              </Link>
              <button
                onClick={() => setCallModalOpen(true)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-purple/30 hover:border-purple/60 hover:text-purple text-purple/80 gap-2"
                )}
              >
                <Phone className="h-4 w-4" />
                Schedule a Call
              </button>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="container mx-auto px-4 pb-32">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Upload Bills",
                description:
                  "Simply upload your commercial energy bills in any format. We'll extract the key data automatically.",
                color: "cyan",
              },
              {
                icon: BarChart3,
                title: "AI Analysis",
                description:
                  "Claude AI reads your bill and extracts every detail — rates, charges, demand, and more.",
                color: "purple",
              },
              {
                icon: Zap,
                title: "Find Savings",
                description:
                  "Compare your rates against NJ utilities and third-party suppliers. See exactly how much you can save.",
                color: "cyan",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass group rounded-xl p-6 transition-all hover:border-cyan/20 hover:shadow-[0_0_30px_rgba(6,245,214,0.05)]"
              >
                <feature.icon
                  className={`h-10 w-10 mb-4 ${
                    feature.color === "cyan" ? "text-cyan" : "text-purple"
                  }`}
                />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ScheduleCallModal open={callModalOpen} onClose={() => setCallModalOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} NJ Bill Analyzer. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
