import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

async function safeJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function isValidEmail(email: unknown): boolean {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function verifyPaystackPayment(reference: string, expectedAmountPesewas: number): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return { ok: true }; // dev fallback: no secret configured, skip verification
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: "Payment verification failed" };
    const data = await res.json();
    if (data?.status !== true || data?.data?.status !== "success") {
      return { ok: false, error: "Payment not successful" };
    }
    if (data.data.currency !== "GHS") return { ok: false, error: "Wrong currency" };
    if (Number(data.data.amount) !== expectedAmountPesewas) {
      return { ok: false, error: "Amount mismatch" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Payment verification failed" };
  }
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
    .orderBy(desc(orders.createdAt))
    .limit(50);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await safeJson(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { orderRef, total, items, email } = body;

  if (typeof orderRef !== "string" || !/^[A-Za-z0-9_-]{4,100}$/.test(orderRef)) {
    return NextResponse.json({ error: "Invalid orderRef" }, { status: 400 });
  }
  const totalNum = Number(total);
  if (!Number.isFinite(totalNum) || totalNum <= 0 || totalNum > 1000000) {
    return NextResponse.json({ error: "Invalid total" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }
  let recomputed = 0;
  for (const item of items) {
    if (!item || typeof item !== "object") {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }
    const price = Number(item.price);
    const qty = Number(item.quantity);
    if (typeof item.id !== "string" || item.id.length === 0 || item.id.length > 200) {
      return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
    }
    if (typeof item.name !== "string" || item.name.trim().length === 0 || item.name.length > 200) {
      return NextResponse.json({ error: "Invalid item name" }, { status: 400 });
    }
    if (!Number.isFinite(price) || price < 0 || price > 1000000) {
      return NextResponse.json({ error: "Invalid item price" }, { status: 400 });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Invalid item quantity" }, { status: 400 });
    }
    recomputed += price * qty;
  }
  // Client total must match sum of line items (prevents total tampering)
  if (Math.abs(recomputed - totalNum) > 0.01) {
    return NextResponse.json({ error: "Total does not match items" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const verification = await verifyPaystackPayment(orderRef, Math.round(totalNum * 100));
  if (!verification.ok) {
    return NextResponse.json({ error: verification.error ?? "Payment verification failed" }, { status: 402 });
  }

  try {
    const created = await db
      .insert(orders)
      .values({
        id: generateId(),
        userId,
        orderRef,
        status: "paid",
        total: String(totalNum),
        items: JSON.stringify(items),
        email,
      })
      .returning();
    return NextResponse.json(created[0], { status: 201 });
  } catch (e: any) {
    // Unique violation on orderRef -> idempotency: already recorded
    if (e?.code === "23505" || String(e?.message ?? "").includes("unique")) {
      return NextResponse.json({ error: "Duplicate order" }, { status: 409 });
    }
    throw e;
  }
}
