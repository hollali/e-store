import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { cartItems } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

function isValidCartItem(item: any): boolean {
  if (!item || typeof item !== "object") return false;
  if (typeof item.id !== "string" || item.id.length === 0 || item.id.length > 200) return false;
  if (typeof item.name !== "string" || item.name.trim().length === 0 || item.name.length > 200) return false;
  const price = Number(item.price);
  if (!Number.isFinite(price) || price < 0 || price > 1000000) return false;
  const qty = Number(item.quantity ?? 1);
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) return false;
  if (item.currency !== undefined && (typeof item.currency !== "string" || item.currency.length > 10)) return false;
  if (item.image !== undefined && item.image !== null && (typeof item.image !== "string" || item.image.length > 2000)) return false;
  return true;
}

async function safeJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
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

  const body = await safeJson(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  if (body.items && typeof body.items === "object") {
    const entries = Object.values(body.items) as any[];
    if (entries.length > 100) {
      return NextResponse.json({ error: "Too many items" }, { status: 400 });
    }
    for (const item of entries) {
      if (!isValidCartItem(item)) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }
    }
    await db.delete(cartItems).where(eq(cartItems.userId, userId));

    if (entries.length > 0) {
      await db.insert(cartItems).values(
        entries.map((item: any) => ({
          id: generateId(),
          userId,
          productId: String(item.id).slice(0, 200),
          name: String(item.name).slice(0, 200),
          price: String(Number(item.price)),
          currency: item.currency || "GHS",
          image: typeof item.image === "string" ? item.image.slice(0, 2000) : null,
          quantity: Math.min(99, Math.max(1, Number(item.quantity) || 1)),
        })),
      );
    }

    return NextResponse.json({ success: true });
  }

  const { productId, name, price, currency, image, quantity } = body;

  if (!isValidCartItem({ id: productId, name, price, quantity: quantity ?? 1, currency, image })) {
    return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    const nextQty = Math.min(99, existing[0].quantity + (Number(quantity) || 1));
    const updated = await db
      .update(cartItems)
      .set({ quantity: nextQty, updatedAt: new Date() })
      .where(and(eq(cartItems.id, existing[0].id), eq(cartItems.userId, userId)))
      .returning();
    return NextResponse.json(updated[0]);
  }

  const created = await db
    .insert(cartItems)
    .values({
      id: generateId(),
      userId,
      productId: String(productId).slice(0, 200),
      name: String(name).slice(0, 200),
      price: String(Number(price)),
      currency: currency || "GHS",
      image: typeof image === "string" ? image.slice(0, 2000) : null,
      quantity: Math.min(99, Math.max(1, Number(quantity) || 1)),
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
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "productId required" }, { status: 400 });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await safeJson(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { productId, quantity } = body;

  if (typeof productId !== "string" || productId.length === 0) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 0 || qty > 99) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  if (qty <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
    return NextResponse.json({ success: true });
  }

  const updated = await db
    .update(cartItems)
    .set({ quantity: qty, updatedAt: new Date() })
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .returning();
  if (!updated[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated[0]);
}
