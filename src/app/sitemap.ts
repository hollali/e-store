import { client } from "@/lib/sanity";

export default async function sitemap() {
  const baseUrl = "https://www.africvouge.com";

  const productsQuery = `*[_type == "product"]{ "slug": slug.current }`;
  const products = await client.fetch(productsQuery);

  const productUrls = products.map((product: { slug: string }) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/all`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/Men`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/Women`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/Accessories`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    ...productUrls,
  ];
}
