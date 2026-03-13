import { TrendingUp, TrendingDown } from "lucide-react";

// Static display values — not live data
const prices = [
  { label: "NJ Electricity (Residential)", value: "$0.1842/kWh", change: +2.1 },
  { label: "NJ Electricity (Commercial)", value: "$0.1356/kWh", change: -0.8 },
  { label: "Natural Gas", value: "$2.47/therm", change: +1.3 },
  { label: "PJM Day-Ahead LMP", value: "$38.52/MWh", change: -3.2 },
  { label: "NJ SREC", value: "$85.00", change: +0.5 },
  { label: "Solar Index", value: "$42.18/MWh", change: +4.7 },
  { label: "PSE&G BGS Rate", value: "$0.1105/kWh", change: -1.1 },
  { label: "JCP&L BGS Rate", value: "$0.1089/kWh", change: +0.3 },
];

type PriceEntry = {
  label: string;
  value: string;
  change: number;
};

function PriceItem({ label, value, change }: PriceEntry) {
  const isUp = change >= 0;
  return (
    <span className="inline-flex items-center gap-3 px-8 text-base whitespace-nowrap">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-bold text-foreground text-lg">{value}</span>
      <span
        className={`inline-flex items-center gap-0.5 font-mono text-sm font-semibold ${
          isUp ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {isUp ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        {isUp ? "+" : ""}
        {change}%
      </span>
    </span>
  );
}

export function PriceTicker() {
  return (
    <div className="w-full overflow-hidden border-b border-border bg-card">
      <div className="ticker-track">
        <div className="ticker-content">
          {prices.map((p) => (
            <PriceItem key={p.label} {...p} />
          ))}
        </div>
        <div className="ticker-content" aria-hidden>
          {prices.map((p) => (
            <PriceItem key={p.label} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
}
