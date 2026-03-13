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
          buttonVariants({ variant: "outline", size: "lg" }),
          "border-purple/30 hover:border-purple/60 hover:text-purple text-purple/80 gap-2"
        )}
      >
        <Phone className="h-4 w-4" />
        Schedule a Call
      </button>
      <ScheduleCallModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
