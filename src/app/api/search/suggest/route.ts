import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

const buckets = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (buckets.get(ip) ?? []).filter((t) => t > now - 60_000);
  hits.push(now);
  buckets.set(ip, hits);
  return hits.length > 60;
}

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`suggest:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) return NextResponse.json([]);
  // Allow letters, numbers, spaces, apostrophes/hyphens for real queries (e.g. "men's")
  const sanitized = q.replace(/[^\p{L}\p{N}\s'-]/gu, "").trim().slice(0, 60);
  if (!sanitized) return NextResponse.json([]);

  // Parameterized GROQ — prevents injection, prefix match is intentional for autocomplete
  const query = `*[_type == "product" && name match $prefix] | order(_createdAt desc)[0...5]{
    _id,
    name,
    "slug": slug.current,
    "imageUrl": images[0].asset->url,
    price
  }`;

  try {
    const results = await client.fetch(query, { prefix: `${sanitized}*` });
    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
