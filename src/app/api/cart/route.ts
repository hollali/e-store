import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { cartItems } from "@/lib/schema";
import { eq } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await req.json();

  if (body.items && typeof body.items === "object") {
    const entries = Object.values(body.items) as any[];
    await db.delete(cartItems).where(eq(cartItems.userId, userId));

    if (entries.length > 0) {
      await db.insert(cartItems).values(
        entries.map((item: any) => ({
          id: generateId(),
          userId,
          productId: item.id,
          name: item.name,
          price: String(item.price),
          currency: item.currency || "GHS",
          image: item.image,
          quantity: item.quantity || 1,
        })),
      );
    }

    return NextResponse.json({ success: true });
  }

  const { productId, name, price, currency, image, quantity } = body;

  const existing = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.productId, productId))
    .limit(1);

  if (existing.length > 0) {
    const updated = await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + (quantity || 1), updatedAt: new Date() })
      .where(eq(cartItems.id, existing[0].id))
      .returning();
    return NextResponse.json(updated[0]);
  }

  const created = await db
    .insert(cartItems)
    .values({
      id: generateId(),
      userId,
      productId,
      name,
      price: String(price),
      currency: currency || "GHS",
      image,
      quantity: quantity || 1,
    })
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

  if (productId === "all") {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return NextResponse.json({ success: true });
  }

  if (productId) {
    await db.delete(cartItems).where(eq(cartItems.productId, productId));
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "productId required" }, { status: 400 });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await req.json();
  const { productId, quantity } = body;

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.productId, productId));
    return NextResponse.json({ success: true });
  }

  const updated = await db
    .update(cartItems)
    .set({ quantity, updatedAt: new Date() })
    .where(eq(cartItems.productId, productId))
    .returning();
  return NextResponse.json(updated[0]);
}
