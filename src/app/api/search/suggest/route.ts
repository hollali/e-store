import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) return NextResponse.json([]);

  const sanitized = q.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  if (!sanitized) return NextResponse.json([]);

  const query = `*[_type == "product" && name match "${sanitized}*"] | order(_createdAt desc)[0...5]{
    _id,
    name,
    "slug": slug.current,
    "imageUrl": images[0].asset->url,
    price
  }`;

  try {
    const results = await client.fetch(query);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
