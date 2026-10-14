import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { wishlistItems } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

function isValidWishlistItem(item: any): boolean {
  if (!item || typeof item !== "object") return false;
  if (typeof item.id !== "string" || item.id.length === 0 || item.id.length > 200) return false;
  if (typeof item.name !== "string" || item.name.trim().length === 0 || item.name.length > 200) return false;
  const price = Number(item.price);
  if (!Number.isFinite(price) || price < 0 || price > 1000000) return false;
  if (item.image !== undefined && item.image !== null && (typeof item.image !== "string" || item.image.length > 2000)) return false;
  if (item.slug !== undefined && item.slug !== null && (typeof item.slug !== "string" || item.slug.length > 200)) return false;
  return true;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const items = await db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.items && Array.isArray(body.items)) {
    if (body.items.length > 200) {
      return NextResponse.json({ error: "Too many items" }, { status: 400 });
    }
    for (const item of body.items) {
      if (!isValidWishlistItem(item)) {
        return NextResponse.json({ error: "Invalid wishlist item" }, { status: 400 });
      }
    }
    await db.delete(wishlistItems).where(eq(wishlistItems.userId, userId));
    if (body.items.length > 0) {
      await db.insert(wishlistItems).values(
        body.items.map((item: any) => ({
          id: generateId(),
          userId,
          productId: String(item.id).slice(0, 200),
          name: String(item.name).slice(0, 200),
          price: String(Number(item.price)),
          image: typeof item.image === "string" ? item.image.slice(0, 2000) : null,
          slug: typeof item.slug === "string" ? item.slug.slice(0, 200) : null,
        })),
      );
    }
    return NextResponse.json({ success: true });
  }

  const { productId, name, price, image } = body;

  if (!isValidWishlistItem({ id: productId, name, price, image, slug: body.slug })) {
    return NextResponse.json({ error: "Invalid wishlist item" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(wishlistItems).where(and(eq(wishlistItems.id, existing[0].id), eq(wishlistItems.userId, userId)));
    return NextResponse.json({ removed: true });
  }

  try {
    const created = await db
      .insert(wishlistItems)
      .values({
        id: generateId(),
        userId,
        productId: String(productId).slice(0, 200),
        name: String(name).slice(0, 200),
        price: String(Number(price)),
        image: typeof image === "string" ? image.slice(0, 2000) : null,
        slug: typeof body.slug === "string" ? body.slug.slice(0, 200) : null,
      })
      .returning();
    return NextResponse.json(created[0], { status: 201 });
  } catch (e: any) {
    if (e?.code === "23505" || String(e?.message ?? "").includes("unique")) {
      return NextResponse.json({ error: "Already in wishlist" }, { status: 409 });
    }
    throw e;
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  await db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
  return NextResponse.json({ success: true });
}
