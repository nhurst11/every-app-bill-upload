"use client";

import { useRouter } from "next/navigation";
import { BillUpload } from "@/components/bill-upload";
import { BillsTable } from "@/components/bills-table";

interface Bill {
  id: string;
  fileName: string;
  utilityProvider: string | null;
  totalAmount: string | null;
  totalKwh: string | null;
  status: string;
  uploadedAt: string;
}

export function DashboardClient({ bills }: { bills: Bill[] }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <BillUpload onUploadComplete={() => router.refresh()} />
      <BillsTable bills={bills} />
    </div>
  );
}
