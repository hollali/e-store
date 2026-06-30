import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { wishlistItems } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
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

  const body = await req.json();

  if (body.items && Array.isArray(body.items)) {
    await db.delete(wishlistItems).where(eq(wishlistItems.userId, userId));
    if (body.items.length > 0) {
      await db.insert(wishlistItems).values(
        body.items.map((item: any) => ({
          id: generateId(),
          userId,
          productId: item.id,
          name: item.name,
          price: String(item.price),
          image: item.image,
        })),
      );
    }
    return NextResponse.json({ success: true });
  }

  const { productId, name, price, image } = body;

  const existing = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, existing[0].id));
    return NextResponse.json({ removed: true });
  }

  const created = await db
    .insert(wishlistItems)
    .values({ id: generateId(), userId, productId, name, price: String(price), image })
    .returning();
  return NextResponse.json(created[0]);
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
