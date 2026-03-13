"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ScheduleCallModal } from "@/components/schedule-call-modal";

export function ScheduleCallButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({ size: "lg" }),
          "bg-accent-color text-primary-foreground hover:bg-accent-color/80 font-bold gap-2 px-8 py-3 text-base shadow-[0_0_40px_rgba(255,102,0,0.4)] tracking-wide"
        )}
      >
        <Phone className="h-5 w-5" />
        Schedule a Call
      </button>
      <ScheduleCallModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
