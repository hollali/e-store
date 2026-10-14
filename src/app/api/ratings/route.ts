import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { reviews } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

// Simple in-memory rate limit: 5 review posts / minute / user
const buckets = new Map<string, number[]>();
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const hits = (buckets.get(key) ?? []).filter((t) => t > windowStart);
  hits.push(now);
  buckets.set(key, hits);
  return hits.length > 5;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

  if (!productId || productId.length > 200) {
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

  return NextResponse.json(items, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (isRateLimited(`ratings:${userId}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { productId, rating, title, body: reviewBody } = body;

  if (typeof productId !== "string" || productId.length === 0 || productId.length > 200) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "Invalid rating data" }, { status: 400 });
  }
  if (title !== undefined && title !== null && (typeof title !== "string" || title.length > 120)) {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }
  if (reviewBody !== undefined && reviewBody !== null && (typeof reviewBody !== "string" || reviewBody.length > 2000)) {
    return NextResponse.json({ error: "Invalid review body" }, { status: 400 });
  }
  if (!reviewBody || String(reviewBody).trim().length < 4) {
    return NextResponse.json({ error: "Please write a few words" }, { status: 400 });
  }

  // Derive display name server-side — never trust client-supplied userName
  const user = await currentUser().catch(() => null);
  const displayName =
    user?.fullName?.trim() ||
    (user?.username as string | null) ||
    user?.primaryEmailAddress?.emailAddress ||
    "Anonymous";

  const existing = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
  }

  try {
    const created = await db
      .insert(reviews)
      .values({
        id: generateId(),
        userId,
        userName: String(displayName).slice(0, 120),
        productId,
        rating: ratingNum,
        title: typeof title === "string" ? title.trim().slice(0, 120) || null : null,
        body: String(reviewBody).trim().slice(0, 2000),
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (e: any) {
    if (e?.code === "23505" || String(e?.message ?? "").includes("unique")) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
    }
    throw e;
  }
}
