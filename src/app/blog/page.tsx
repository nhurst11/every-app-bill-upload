"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const posts = [
  {
    id: 1,
    title: "Understanding Your NJ Commercial Energy Bill",
    excerpt:
      "Learn how to read your commercial energy bill line by line — from supply charges to demand fees — so you know exactly where your money goes.",
    date: "2026-03-10",
    readTime: "5 min read",
    tag: "Guide",
  },
  {
    id: 2,
    title: "NJ Energy Deregulation: What It Means for Your Business",
    excerpt:
      "New Jersey's deregulated energy market lets businesses choose their supplier. Here's how to take advantage and potentially cut costs by 15-20%.",
    date: "2026-03-05",
    readTime: "4 min read",
    tag: "Industry",
  },
  {
    id: 3,
    title: "5 Ways to Reduce Your Commercial Energy Costs This Summer",
    excerpt:
      "Summer peak demand charges can spike your bill. These five strategies help NJ businesses stay ahead of seasonal rate increases.",
    date: "2026-02-28",
    readTime: "3 min read",
    tag: "Tips",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      {/* Nav */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            <span className="text-accent-color">NJ</span> Bill Analyzer
          </Link>
          <div className="flex gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-muted-foreground hover:text-accent-color"
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants(),
                "bg-accent-color text-primary-foreground hover:bg-accent-color/80 font-medium"
              )}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-color mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-color/20 bg-accent-color/5 px-4 py-1.5 text-sm text-accent-color">
            <Zap className="h-3.5 w-3.5" />
            Energy Insights
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Blog &{" "}
            <span className="bg-gradient-to-r from-accent-color to-accent-alt bg-clip-text text-transparent">
              Tips
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Practical advice for NJ businesses looking to understand and reduce
            their energy costs.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="glass group rounded-xl p-6 transition-all hover:border-accent-color/20 hover:shadow-[0_0_30px_rgba(255,102,0,0.05)] flex flex-col"
            >
              <div className="mb-3">
                <span className="inline-block rounded-full border border-accent-alt/30 bg-accent-alt/10 px-3 py-0.5 text-xs font-medium text-accent-alt">
                  {post.tag}
                </span>
              </div>
              <h2 className="text-lg font-semibold mb-2 group-hover:text-accent-color transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

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
