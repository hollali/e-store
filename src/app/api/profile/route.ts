import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { profiles } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return NextResponse.json(rows[0] ?? null);
}

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const values = {
    userId,
    phone: typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : null,
    addressLine1: typeof body.addressLine1 === "string" ? body.addressLine1.trim().slice(0, 200) : null,
    addressLine2: typeof body.addressLine2 === "string" ? body.addressLine2.trim().slice(0, 200) : null,
    city: typeof body.city === "string" ? body.city.trim().slice(0, 100) : null,
    region: typeof body.region === "string" ? body.region.trim().slice(0, 100) : null,
    postalCode: typeof body.postalCode === "string" ? body.postalCode.trim().slice(0, 20) : null,
    country: typeof body.country === "string" ? body.country.trim().slice(0, 100) : null,
  };
  await db
    .insert(profiles)
    .values(values)
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        phone: values.phone,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        region: values.region,
        postalCode: values.postalCode,
        country: values.country,
        updatedAt: new Date(),
      },
    });
  return NextResponse.json({ ok: true });
}
