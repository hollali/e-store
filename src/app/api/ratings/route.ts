import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { reviews } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const limit = Math.min(50, Number(searchParams.get("limit")) || 20);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const items = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await req.json();
  const { productId, rating, title, body: reviewBody, userName } = body;

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating data" }, { status: 400 });
  }

  const displayName = userName || "Anonymous";

  const existing = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
  }

  const created = await db
    .insert(reviews)
    .values({
      id: generateId(),
      userId,
      userName: displayName,
      productId,
      rating,
      title,
      body: reviewBody,
    })
    .returning();

  return NextResponse.json(created[0]);
}
