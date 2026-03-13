"use client";

import { Upload, Brain, TrendingDown } from "lucide-react";
import { BillUpload } from "@/components/bill-upload";

interface OnboardingProps {
  onUploadComplete: () => void;
}

const steps = [
  {
    icon: Upload,
    title: "Upload Your Bill",
    description: "Drop a PDF or image of your NJ commercial energy bill",
    color: "cyan" as const,
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "We extract key terms, rates, and charges automatically",
    color: "purple" as const,
  },
  {
    icon: TrendingDown,
    title: "See Savings",
    description: "Compare your rates against NJ suppliers and find savings",
    color: "cyan" as const,
  },
];

export function Onboarding({ onUploadComplete }: OnboardingProps) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="glass rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Get started with <span className="text-accent-color">NJ Bill Analyzer</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Upload your first commercial energy bill and we&apos;ll break down your
          costs, compare rates, and find potential savings.
        </p>
      </div>

      {/* Steps */}
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="glass rounded-xl p-6 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  step.color === "cyan"
                    ? "bg-accent-color/10 text-accent-color"
                    : "bg-accent-alt/10 text-accent-alt"
                }`}
              >
                <step.icon className="h-7 w-7" />
              </div>
            </div>
            {/* Step number badge */}
            <div className="flex justify-center mb-3">
              <span className="gradient-accent text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center text-background">
                {i + 1}
              </span>
            </div>
            <h3 className="font-semibold mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Upload */}
      <BillUpload onUploadComplete={onUploadComplete} />
    </div>
  );
}
