import { getDb } from './db';
import { reviews } from './schema';
import { sql, inArray } from 'drizzle-orm';

export interface ProductRating {
  productId: string;
  average: number;
  count: number;
}

export async function getBatchRatings(productIds: string[]): Promise<Map<string, ProductRating>> {
  if (productIds.length === 0) return new Map();

  const db = await getDb();
  if (!db) return new Map();

  const result = await db
    .select({
      productId: reviews.productId,
      average: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(inArray(reviews.productId, productIds))
    .groupBy(reviews.productId);

  const map = new Map<string, ProductRating>();
  for (const r of result) {
    map.set(r.productId, {
      productId: r.productId,
      average: Math.round(Number(r.average) * 10) / 10,
      count: Number(r.count),
    });
  }
  return map;
}

export async function getProductRating(productId: string): Promise<ProductRating | null> {
  const map = await getBatchRatings([productId]);
  return map.get(productId) || null;
}
