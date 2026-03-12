"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface Bill {
  id: string;
  fileName: string;
  utilityProvider: string | null;
  totalAmount: string | null;
  totalKwh: string | null;
  status: string;
  uploadedAt: string;
}

export function BillsTable({ bills }: { bills: Bill[] }) {
  if (bills.length === 0) {
    return (
      <div className="glass flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 mb-4">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">No bills yet</p>
        <p className="text-sm text-muted-foreground">
          Upload your first energy bill above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-muted-foreground">File</TableHead>
            <TableHead className="text-muted-foreground">Utility</TableHead>
            <TableHead className="text-right text-muted-foreground">Amount</TableHead>
            <TableHead className="text-right text-muted-foreground">kWh</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id} className="border-white/5 hover:bg-white/[0.02]">
              <TableCell className="font-medium">{bill.fileName}</TableCell>
              <TableCell>{bill.utilityProvider ?? "—"}</TableCell>
              <TableCell className="text-right tabular-nums">
                {bill.totalAmount
                  ? `$${Number(bill.totalAmount).toFixed(2)}`
                  : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {bill.totalKwh
                  ? Number(bill.totalKwh).toLocaleString()
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    bill.status === "analyzed"
                      ? "bg-cyan/10 text-cyan border-cyan/20 hover:bg-cyan/15"
                      : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15"
                  }
                  variant="outline"
                >
                  {bill.status}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums text-muted-foreground">
                {new Date(bill.uploadedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/bills/${bill.id}`}
                  className="text-sm text-cyan hover:underline underline-offset-4"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
