import { client } from "@/lib/sanity";
import { simplifiedProduct } from "@/app/interface";
import Link from "next/link";
import { Search, Lightbulb, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getBatchRatings } from "@/lib/ratings";

const ITEMS_PER_PAGE = 12;

async function getData(query: string, page: number) {
  try {
    const sanitized = query.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    if (!sanitized) return { products: [], total: 0, similar: [] };

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const [products, total] = await Promise.all([
      client.fetch(
        `*[_type == "product" && name match "*${sanitized}*"] | order(_createdAt desc)[$start...$end]{
          _id,
          price,
          name,
          "slug": slug.current,
          "categoryName": category->name,
          "imageUrl": images[0].asset->url,
          price_id
        }`,
        { start, end },
      ),
      client.fetch(
        `count(*[_type == "product" && name match "*${sanitized}*"])`,
      ),
    ]);

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

    let similar: any[] = [];
    if (products.length === 0) {
      try {
        similar = await client.fetch(
          `*[_type == "product" && category->name match "*${sanitized}*"] | order(_createdAt desc)[0...4]{
            _id,
            price,
            name,
            "slug": slug.current,
            "categoryName": category->name,
            "imageUrl": images[0].asset->url,
            price_id
          }`,
        );
        if (similar.length === 0) {
          similar = await client.fetch(
            `*[_type == "product"] | order(_createdAt desc)[0...4]{
              _id,
              price,
              name,
              "slug": slug.current,
              "categoryName": category->name,
              "imageUrl": images[0].asset->url,
              price_id
            }`,
          );
        }
        const similarIds = similar.map((p: any) => p.price_id).filter(Boolean);
        const similarRatings = await getBatchRatings(similarIds);
        similar = similar.map((p: any) => {
          const r = p.price_id ? similarRatings.get(p.price_id) : undefined;
          return { ...p, rating: r?.average, reviewCount: r?.count };
        });
      } catch {
        similar = [];
      }
    }

    return { products: enriched, total, similar };
  } catch {
    return { products: [], total: 0, similar: [] };
  }
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search - AfricVogue",
  description: "Search results for products at AfricVogue.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || "";
  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const { products, total, similar } = await getData(query, currentPage);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {query ? `Search results for "${query}"` : "Search Products"}
          </h2>
          {!query && (
            <p className="text-gray-500 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Type a product name in the search bar above
            </p>
          )}
        </div>
        {products.length === 0 && query ? (
          <div className="text-center mt-8 max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No results for &ldquo;{query}&rdquo;
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              We couldn&apos;t find any products matching your search. Try these instead:
            </p>
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="flex items-start gap-3 text-left bg-gray-50 rounded-lg p-3 w-full">
                <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Check your spelling</p>
                  <p className="text-xs text-gray-500">A small typo can change your results</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left bg-gray-50 rounded-lg p-3 w-full">
                <ShoppingBag className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Try different keywords</p>
                  <p className="text-xs text-gray-500">Use broader terms like &quot;dress&quot; instead of &quot;evening gown&quot;</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Link
                href="/Men"
                className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Men
              </Link>
              <Link
                href="/Women"
                className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Women
              </Link>
              <Link
                href="/Accessories"
                className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Accessories
              </Link>
              <Link
                href="/all"
                className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                View All Products
              </Link>
            </div>
            {similar.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
                  You might like
                </h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                  {similar.map((product: simplifiedProduct) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product: simplifiedProduct) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/search"
              searchParams={{ q: query }}
            />
          </>
        )}
        <div className="flex justify-center items-center h-full mt-8">
          <div className="flex h-12 w-64 divide-x overflow-hidden rounded-lg border">
            <Link
              href="/Men"
              className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
            >
              Men
            </Link>
            <Link
              href="/Women"
              className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
            >
              Women
            </Link>
            <Link
              href="/Accessories"
              className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
            >
              Trimmings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
