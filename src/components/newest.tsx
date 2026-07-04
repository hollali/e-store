import { simplifiedProduct } from "@/app/interface";
import { client } from "@/lib/sanity";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getBatchRatings } from "@/lib/ratings";

async function getData() {
  try {
    const query = `*[_type == "product"][0...4] | order(_createdAt desc) {
      _id,
      price,
      name,
      "slug": slug.current,
      "categoryName": category->name,
      "imageUrl": images[0].asset->url,
      price_id
    }`;
    const products = await client.fetch(query);

    let enriched = products;
    try {
      const productIds = products.map((p: any) => p.price_id).filter(Boolean);
      const ratingMap = await getBatchRatings(productIds);
      enriched = products.map((p: any) => {
        const rating = p.price_id ? ratingMap.get(p.price_id) : undefined;
        return { ...p, rating: rating?.average, reviewCount: rating?.count };
      });
    } catch {
      // ratings unavailable, show products without ratings
    }

    return enriched;
  } catch {
    return [];
  }
}

export default async function Newest() {
  const data: simplifiedProduct[] = await getData();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Our Newest Products
          </h2>
          <Link className="text-primary flex items-center gap-x-1" href="/all">
            See All
            <span>
              <ArrowRight />
            </span>
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
