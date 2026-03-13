import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  findUtilityByName,
  calculateSavings,
  thirdPartySuppliers,
} from "@/lib/nj-rates";

interface SavingsCardProps {
  utilityProvider: string | null;
  supplyRatePerKwh: string | null;
  totalKwh: string | null;
}

export function SavingsCard({
  utilityProvider,
  supplyRatePerKwh,
  totalKwh,
}: SavingsCardProps) {
  const supplyRate = supplyRatePerKwh ? Number(supplyRatePerKwh) : null;
  const kwh = totalKwh ? Number(totalKwh) : null;
  const utility = utilityProvider ? findUtilityByName(utilityProvider) : null;

  if (!supplyRate || !kwh) {
    return (
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">Savings Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Not enough data to calculate savings. We need your supply rate and kWh
          usage from the bill.
        </p>
      </div>
    );
  }

  const savings = calculateSavings(supplyRate, kwh);
  const bestSaving = savings.reduce((best, current) =>
    current.annualSavings > best.annualSavings ? current : best
  );
  const hasSavings = bestSaving.annualSavings > 0;

  const rowColors = [
    "text-[#2563EB]",  // Blue
    "text-[#16A34A]",  // Green
    "text-[#9333EA]",  // Purple
    "text-[#DC2626]",  // Red
    "text-[#0891B2]",  // Cyan
    "text-[#CA8A04]",  // Yellow
  ];

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-1">Savings Analysis</h3>
      <p className="text-sm text-muted-foreground mb-6">
        {utility
          ? `Your rate vs ${utility.name} BGS rate and third-party suppliers`
          : "Your rate vs NJ third-party energy suppliers"}
      </p>

      {/* Current rate comparison */}
      {utility && (
        <div className="mb-6 rounded-xl bg-white/[0.03] border border-border p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Your supply rate
          </p>
          <p className="text-3xl font-bold tabular-nums text-accent-color text-glow-accent">
            {supplyRate.toFixed(2)}&cent;<span className="text-base font-normal text-muted-foreground">/kWh</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {utility.name} BGS rate:{" "}
            <span className="tabular-nums">{utility.supplyRate.toFixed(2)}&cent;/kWh</span>
            {supplyRate > utility.supplyRate ? (
              <span className="ml-2 text-red-400">
                ({(supplyRate - utility.supplyRate).toFixed(2)}&cent; more)
              </span>
            ) : (
              <span className="ml-2 text-accent-color">
                ({(utility.supplyRate - supplyRate).toFixed(2)}&cent; less)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Third-party supplier comparison */}
      {hasSavings ? (
        <>
          <p className="mb-3 text-sm font-medium">
            Third-party supplier options:
          </p>
          <div className="rounded-xl overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Supplier</TableHead>
                  <TableHead className="text-right text-muted-foreground">Rate</TableHead>
                  <TableHead className="text-muted-foreground">Term</TableHead>
                  <TableHead className="text-right text-muted-foreground">Monthly</TableHead>
                  <TableHead className="text-right text-muted-foreground">Annual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savings
                  .filter((s) => s.annualSavings > 0)
                  .sort((a, b) => b.annualSavings - a.annualSavings)
                  .map((s, index) => {
                    const supplier = thirdPartySuppliers.find(
                      (tp) => tp.supplier === s.supplier
                    )!;
                    const isBest = s.supplier === bestSaving.supplier;
                    const color = rowColors[index % rowColors.length];
                    return (
                      <TableRow key={s.supplier} className="border-border hover:bg-card">
                        <TableCell className="font-medium">
                          {s.supplier}
                          {supplier.renewable && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200"
                            >
                              Green
                            </Badge>
                          )}
                          {isBest && (
                            <Badge className="ml-2 bg-[#1A1A1A] text-white border-0">
                              Best
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {s.comparisonRate.toFixed(2)}&cent;
                        </TableCell>
                        <TableCell className="text-muted-foreground">{supplier.term}</TableCell>
                        <TableCell className={`text-right tabular-nums font-medium ${color}`}>
                          ${s.monthlySavings.toFixed(2)}
                        </TableCell>
                        <TableCell className={`text-right tabular-nums font-medium ${color}`}>
                          ${s.annualSavings.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {/* Total Annual Savings highlight */}
          <div className="mt-4 rounded-xl bg-[#16A34A] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                  Total Annual Savings
                </p>
                <p className="text-sm text-white/80 mt-0.5">
                  with {bestSaving.supplier} (best rate)
                </p>
              </div>
              <p className="text-3xl font-bold tabular-nums text-white">
                ${bestSaving.annualSavings.toFixed(2)}
                <span className="text-sm font-normal text-white/70">/yr</span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-accent-color/5 border border-accent-color/10 p-5 text-center">
          <p className="text-lg font-medium text-accent-color text-glow-accent">
            You&apos;re already competitive!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Your supply rate of{" "}
            <span className="tabular-nums">{supplyRate.toFixed(2)}&cent;/kWh</span> is at or below
            most third-party supplier rates.
          </p>
        </div>
      )}
    </div>
  );
}
