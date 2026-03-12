import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { bills } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userBills = await db
    .select()
    .from(bills)
    .where(eq(bills.userId, session.user.id))
    .orderBy(desc(bills.uploadedAt));

  return NextResponse.json({ bills: userBills });
}
