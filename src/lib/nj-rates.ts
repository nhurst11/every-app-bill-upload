// NJ Commercial Energy Rates (cents per kWh)
// Sources: NJ BPU Basic Generation Service rates + public utility tariffs
// Last updated: March 2026

export interface UtilityRate {
  name: string;
  supplyRate: number; // cents per kWh
  deliveryRate: number; // cents per kWh
  totalRate: number; // cents per kWh
}

export interface ThirdPartyRate {
  supplier: string;
  rate: number; // cents per kWh (supply only)
  term: string; // contract length
  renewable: boolean;
}

export interface SavingsResult {
  currentSupplyRate: number;
  comparisonRate: number;
  supplier: string;
  monthlySavings: number; // dollars
  annualSavings: number; // dollars
  monthlyKwh: number;
}

// The 4 major NJ electric utilities and their BGS (Basic Generation Service) rates
export const njUtilities: UtilityRate[] = [
  {
    name: "PSE&G",
    supplyRate: 10.23,
    deliveryRate: 7.29,
    totalRate: 17.52,
  },
  {
    name: "JCP&L",
    supplyRate: 11.14,
    deliveryRate: 7.24,
    totalRate: 18.38,
  },
  {
    name: "Atlantic City Electric",
    supplyRate: 10.45,
    deliveryRate: 6.32,
    totalRate: 16.77,
  },
  {
    name: "Rockland Electric",
    supplyRate: 10.67,
    deliveryRate: 7.22,
    totalRate: 17.89,
  },
];

// Sample third-party supplier rates (supply-only, customer keeps same delivery)
export const thirdPartySuppliers: ThirdPartyRate[] = [
  { supplier: "Direct Energy Business", rate: 9.12, term: "12 months", renewable: false },
  { supplier: "Constellation Energy", rate: 9.45, term: "24 months", renewable: false },
  { supplier: "Verde Energy", rate: 9.89, term: "12 months", renewable: true },
  { supplier: "CleanChoice Energy", rate: 10.15, term: "12 months", renewable: true },
  { supplier: "Ambit Energy", rate: 8.95, term: "6 months", renewable: false },
];

/**
 * Find a utility by name (fuzzy match)
 */
export function findUtilityByName(providerName: string): UtilityRate | null {
  if (!providerName) return null;
  const lower = providerName.toLowerCase();

  for (const utility of njUtilities) {
    const utilLower = utility.name.toLowerCase();
    // Check if either contains the other, or common abbreviations
    if (lower.includes(utilLower) || utilLower.includes(lower)) {
      return utility;
    }
  }

  // Common abbreviations
  if (lower.includes("pseg") || lower.includes("pse&g") || lower.includes("ps&eg")) {
    return njUtilities[0];
  }
  if (lower.includes("jcpl") || lower.includes("jcp&l") || lower.includes("jersey central")) {
    return njUtilities[1];
  }
  if (lower.includes("ace") || lower.includes("atlantic city")) {
    return njUtilities[2];
  }
  if (lower.includes("reco") || lower.includes("rockland")) {
    return njUtilities[3];
  }

  return null;
}

/**
 * Calculate savings for each third-party supplier vs the user's current supply rate
 */
export function calculateSavings(
  currentSupplyRateCents: number,
  monthlyKwh: number
): SavingsResult[] {
  return thirdPartySuppliers.map((supplier) => {
    const rateDiffCents = currentSupplyRateCents - supplier.rate;
    const monthlySavings = (rateDiffCents * monthlyKwh) / 100; // convert cents to dollars
    const annualSavings = monthlySavings * 12;

    return {
      currentSupplyRate: currentSupplyRateCents,
      comparisonRate: supplier.rate,
      supplier: supplier.supplier,
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      annualSavings: Math.round(annualSavings * 100) / 100,
      monthlyKwh,
    };
  });
}
