import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const items = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(orders.createdAt);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await req.json();
  const { orderRef, total, items, email } = body;

  const created = await db
    .insert(orders)
    .values({ id: generateId(), userId, orderRef, total: String(total), items: JSON.stringify(items), email })
    .returning();
  return NextResponse.json(created[0]);
}
