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
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <FileText className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-medium">No bills yet</p>
        <p className="text-sm text-muted-foreground">
          Upload your first energy bill above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead>Utility</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">kWh</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell className="font-medium">{bill.fileName}</TableCell>
              <TableCell>{bill.utilityProvider ?? "—"}</TableCell>
              <TableCell className="text-right">
                {bill.totalAmount
                  ? `$${Number(bill.totalAmount).toFixed(2)}`
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                {bill.totalKwh
                  ? Number(bill.totalKwh).toLocaleString()
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={bill.status === "analyzed" ? "default" : "destructive"}
                >
                  {bill.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(bill.uploadedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/bills/${bill.id}`}
                  className="text-sm text-primary underline-offset-4 hover:underline"
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
