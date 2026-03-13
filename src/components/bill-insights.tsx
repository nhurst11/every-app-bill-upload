"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillInsightsProps {
  billId: string;
  cachedInsights: string | null;
}

export function BillInsights({ billId, cachedInsights }: BillInsightsProps) {
  const [insights, setInsights] = useState<string | null>(cachedInsights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateInsights() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/bills/${billId}/insights`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate insights");
      }

      const data = await res.json();
      setInsights(data.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Loading state with shimmer animation
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-accent-color/20 bg-gradient-to-br from-accent-color/5 to-accent-alt/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-accent-color animate-pulse" />
          <h3 className="text-lg font-semibold">Generating AI Insights...</h3>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div
                className="h-4 rounded bg-white/5 animate-pulse"
                style={{ width: `${60 + i * 10}%`, animationDelay: `${i * 150}ms` }}
              />
              <div
                className="h-3 rounded bg-white/5 animate-pulse"
                style={{ width: `${80 - i * 5}%`, animationDelay: `${i * 150 + 75}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No insights yet — show generate button
  if (!insights) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-accent-color/20 bg-gradient-to-br from-accent-color/5 to-accent-alt/5 p-6 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-accent-color mb-3" />
        <h3 className="text-lg font-semibold mb-1">AI Bill Insights</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get personalized analysis of your bill against current NJ market rates
        </p>
        <Button
          onClick={generateInsights}
          className="bg-accent-color hover:bg-accent-color/90 text-black font-medium"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Insights
        </Button>
        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Render insights with simple markdown-to-HTML
  return (
    <div className="relative overflow-hidden rounded-xl border border-accent-color/20 bg-gradient-to-br from-accent-color/5 to-accent-alt/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent-color" />
        <h3 className="text-lg font-semibold">AI Bill Insights</h3>
      </div>
      <div
        className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-p:text-muted-foreground
          prose-strong:text-accent-color prose-li:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(insights) }}
      />
    </div>
  );
}

/**
 * Minimal markdown to HTML converter for insight text.
 * Handles bold, headings, lists, and paragraphs.
 */
function markdownToHtml(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      // Headings
      if (block.startsWith("### ")) return `<h3>${inline(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h3>${inline(block.slice(3))}</h3>`;

      // Unordered list
      if (block.match(/^[-*] /m)) {
        const items = block
          .split("\n")
          .filter((l) => l.match(/^[-*] /))
          .map((l) => `<li>${inline(l.replace(/^[-*] /, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      // Ordered list
      if (block.match(/^\d+\. /m)) {
        const items = block
          .split("\n")
          .filter((l) => l.match(/^\d+\. /))
          .map((l) => `<li>${inline(l.replace(/^\d+\. /, ""))}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }

      return `<p>${inline(block)}</p>`;
    })
    .join("");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
}
