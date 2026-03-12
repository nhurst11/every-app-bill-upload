import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { bills } from "@/db/schema";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File must be a PDF, PNG, JPG, or WebP" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 10MB" },
      { status: 400 }
    );
  }

  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const isPdf = file.type === "application/pdf";

  // Build the file content block with proper typing
  const fileBlock = isPdf
    ? {
        type: "document" as const,
        source: {
          type: "base64" as const,
          media_type: "application/pdf" as const,
          data: base64,
        },
      }
    : {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: file.type as "image/png" | "image/jpeg" | "image/webp",
          data: base64,
        },
      };

  try {
    // Send to Claude for extraction
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            fileBlock,
            {
              type: "text",
              text: `You are analyzing a New Jersey commercial energy bill. Extract the following data and return ONLY valid JSON (no markdown, no explanation):

{
  "utilityProvider": "name of the utility company",
  "accountNumber": "account number",
  "billingPeriodStart": "YYYY-MM-DD",
  "billingPeriodEnd": "YYYY-MM-DD",
  "totalAmount": 0.00,
  "totalKwh": 0.00,
  "supplyRatePerKwh": 0.0000,
  "deliveryCharges": 0.00,
  "demandKw": 0.00,
  "demandCharges": 0.00,
  "taxesAndFees": 0.00,
  "rateClass": "rate class code"
}

Rules:
- supplyRatePerKwh should be in cents (e.g., 10.23 means 10.23 cents per kWh)
- All dollar amounts should be numbers, not strings
- If a field is not found on the bill, use null
- For billingPeriodStart and billingPeriodEnd, use ISO date format (YYYY-MM-DD)
- Look for the utility name, often at the top of the bill
- Account number may be labeled "Account #", "Customer Account", etc.
- Supply rate is often under "Generation" or "BGS" charges
- Delivery charges include transmission and distribution
- Demand is measured in kW and is common on commercial bills`,
            },
          ],
        },
      ],
    });

    // Extract text from Claude's response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response (handle potential markdown wrapping)
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const extracted = JSON.parse(cleaned);

    // Insert into database
    const [bill] = await db
      .insert(bills)
      .values({
        userId: session.user.id,
        fileName: file.name,
        utilityProvider: extracted.utilityProvider,
        accountNumber: extracted.accountNumber,
        billingPeriodStart: extracted.billingPeriodStart
          ? new Date(extracted.billingPeriodStart)
          : null,
        billingPeriodEnd: extracted.billingPeriodEnd
          ? new Date(extracted.billingPeriodEnd)
          : null,
        totalAmount: extracted.totalAmount?.toString() ?? null,
        totalKwh: extracted.totalKwh?.toString() ?? null,
        supplyRatePerKwh: extracted.supplyRatePerKwh?.toString() ?? null,
        deliveryCharges: extracted.deliveryCharges?.toString() ?? null,
        demandKw: extracted.demandKw?.toString() ?? null,
        demandCharges: extracted.demandCharges?.toString() ?? null,
        taxesAndFees: extracted.taxesAndFees?.toString() ?? null,
        rateClass: extracted.rateClass,
        analysisJson: responseText,
        status: "analyzed",
      })
      .returning();

    return NextResponse.json({ bill });
  } catch (error) {
    console.error("Bill analysis failed:", error);

    // Still save the bill but with error status
    const [bill] = await db
      .insert(bills)
      .values({
        userId: session.user.id,
        fileName: file.name,
        analysisJson:
          error instanceof Error ? error.message : "Unknown error",
        status: "error",
      })
      .returning();

    return NextResponse.json(
      { bill, error: "Analysis failed. The bill was saved but could not be analyzed." },
      { status: 500 }
    );
  }
}
