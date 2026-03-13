import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { bills } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { njUtilities, thirdPartySuppliers, findUtilityByName } from "@/lib/nj-rates";

const anthropic = new Anthropic();

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch bill and verify ownership
  const [bill] = await db
    .select()
    .from(bills)
    .where(and(eq(bills.id, id), eq(bills.userId, session.user.id)))
    .limit(1);

  if (!bill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }

  // Return cached insights if they exist
  if (bill.insights) {
    return NextResponse.json({ insights: bill.insights });
  }

  // Build rate context for Claude
  const userUtility = bill.utilityProvider
    ? findUtilityByName(bill.utilityProvider)
    : null;

  const rateContext = `
## NJ BGS (Basic Generation Service) Rates
${njUtilities.map((u) => `- ${u.name}: Supply ${u.supplyRate}¢/kWh, Delivery ${u.deliveryRate}¢/kWh, Total ${u.totalRate}¢/kWh`).join("\n")}

## Third-Party Supplier Rates (supply only)
${thirdPartySuppliers.map((s) => `- ${s.supplier}: ${s.rate}¢/kWh (${s.term}${s.renewable ? ", renewable" : ""})`).join("\n")}

${userUtility ? `## User's Utility: ${userUtility.name}\nBGS supply rate: ${userUtility.supplyRate}¢/kWh` : ""}
`.trim();

  const billData = `
- Utility Provider: ${bill.utilityProvider ?? "Unknown"}
- Account Number: ${bill.accountNumber ?? "Unknown"}
- Billing Period: ${bill.billingPeriodStart?.toLocaleDateString() ?? "?"} to ${bill.billingPeriodEnd?.toLocaleDateString() ?? "?"}
- Total Amount: $${bill.totalAmount ?? "?"}
- Total kWh: ${bill.totalKwh ?? "?"}
- Supply Rate: ${bill.supplyRatePerKwh ?? "?"}¢/kWh
- Delivery Charges: $${bill.deliveryCharges ?? "?"}
- Demand (kW): ${bill.demandKw ?? "N/A"}
- Demand Charges: $${bill.demandCharges ?? "N/A"}
- Taxes & Fees: $${bill.taxesAndFees ?? "?"}
- Rate Class: ${bill.rateClass ?? "Unknown"}
`.trim();

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a New Jersey commercial energy consultant. Analyze this customer's electricity bill against current NJ market rates and provide actionable insights.

## Customer's Bill Data
${billData}

## Current NJ Market Rates
${rateContext}

Provide 3-5 specific, actionable insights in markdown format. Each insight should have a bold title and 2-3 sentences of explanation. Focus on:

1. **Rate competitiveness** — How does their supply rate compare to their utility's BGS rate and third-party suppliers? Include specific dollar amounts they could save.
2. **Demand charge analysis** — If they have demand charges, explain what this means and whether demand response programs could help. If no demand charges, note this is good.
3. **Seasonal context** — Based on the billing period, what seasonal patterns should they expect? Are rates typically higher or lower in the coming months?
4. **Specific savings opportunities** — Calculate exact monthly/annual savings if they switched to the cheapest available supplier. Name the supplier and rate.
5. **Overall bill health** — Is their cost per kWh reasonable? Any red flags in the breakdown?

Use actual numbers from their bill and the market data. Be specific with dollar amounts. Write in a friendly, consultative tone — like a trusted energy advisor, not a sales pitch.`,
        },
      ],
    });

    const insightsText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Cache insights in database
    await db
      .update(bills)
      .set({ insights: insightsText })
      .where(eq(bills.id, id));

    return NextResponse.json({ insights: insightsText });
  } catch (error) {
    console.error("Insights generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate insights. Please try again." },
      { status: 500 }
    );
  }
}
