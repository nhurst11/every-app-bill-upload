"use client";

import { useRouter } from "next/navigation";
import { BillUpload } from "@/components/bill-upload";
import { BillsTable } from "@/components/bills-table";
import { DashboardCharts } from "@/components/dashboard-charts";
import { Onboarding } from "@/components/onboarding";

interface Bill {
  id: string;
  fileName: string;
  utilityProvider: string | null;
  totalAmount: string | null;
  totalKwh: string | null;
  supplyRatePerKwh: string | null;
  deliveryCharges: string | null;
  demandKw: string | null;
  demandCharges: string | null;
  taxesAndFees: string | null;
  billingPeriodStart: string | null;
  billingPeriodEnd: string | null;
  status: string;
  uploadedAt: string;
}

export function DashboardClient({ bills }: { bills: Bill[] }) {
  const router = useRouter();

  if (bills.length === 0) {
    return <Onboarding onUploadComplete={() => router.refresh()} />;
  }

  return (
    <div className="space-y-6">
      <BillUpload onUploadComplete={() => router.refresh()} />
      <DashboardCharts bills={bills} />
      <BillsTable bills={bills} />
    </div>
  );
}
