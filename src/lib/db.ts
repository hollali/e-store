let _db: any = null;

export async function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  const schema = await import("./schema");

  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}
