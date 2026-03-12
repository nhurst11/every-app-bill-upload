import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  findUtilityByName,
  calculateSavings,
  thirdPartySuppliers,
} from "@/lib/nj-rates";

interface SavingsCardProps {
  utilityProvider: string | null;
  supplyRatePerKwh: string | null; // cents
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
      <Card>
        <CardHeader>
          <CardTitle>Savings Analysis</CardTitle>
          <CardDescription>
            Not enough data to calculate savings. We need your supply rate and kWh
            usage from the bill.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const savings = calculateSavings(supplyRate, kwh);
  const bestSaving = savings.reduce((best, current) =>
    current.annualSavings > best.annualSavings ? current : best
  );
  const hasSavings = bestSaving.annualSavings > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Analysis</CardTitle>
        <CardDescription>
          {utility
            ? `Your rate vs ${utility.name} BGS rate and third-party suppliers`
            : "Your rate vs NJ third-party energy suppliers"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current rate comparison */}
        {utility && (
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Your supply rate</p>
            <p className="text-2xl font-bold">{supplyRate.toFixed(2)}&cent;/kWh</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {utility.name} BGS rate: {utility.supplyRate.toFixed(2)}&cent;/kWh
              {supplyRate > utility.supplyRate ? (
                <span className="ml-2 text-red-600">
                  (you&apos;re paying {(supplyRate - utility.supplyRate).toFixed(2)}&cent; more)
                </span>
              ) : (
                <span className="ml-2 text-green-600">
                  (you&apos;re paying {(utility.supplyRate - supplyRate).toFixed(2)}&cent; less)
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
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-right">Monthly Savings</TableHead>
                    <TableHead className="text-right">Annual Savings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savings
                    .filter((s) => s.annualSavings > 0)
                    .sort((a, b) => b.annualSavings - a.annualSavings)
                    .map((s) => {
                      const supplier = thirdPartySuppliers.find(
                        (tp) => tp.supplier === s.supplier
                      )!;
                      const isBest = s.supplier === bestSaving.supplier;
                      return (
                        <TableRow key={s.supplier}>
                          <TableCell className="font-medium">
                            {s.supplier}
                            {supplier.renewable && (
                              <Badge variant="outline" className="ml-2">
                                Green
                              </Badge>
                            )}
                            {isBest && (
                              <Badge className="ml-2 bg-green-600">
                                Best
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {s.comparisonRate.toFixed(2)}&cent;
                          </TableCell>
                          <TableCell>{supplier.term}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ${s.monthlySavings.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ${s.annualSavings.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950">
            <p className="text-lg font-medium text-green-700 dark:text-green-300">
              You&apos;re already competitive!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Your supply rate of {supplyRate.toFixed(2)}&cent;/kWh is at or below
              most third-party supplier rates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
