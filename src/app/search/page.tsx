import { client } from "@/lib/sanity";
import { simplifiedProduct } from "@/app/interface";
import Link from "next/link";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 12;

async function getData(query: string, page: number) {
  try {
    const sanitized = query.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    if (!sanitized) return { products: [], total: 0 };

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
          "imageUrl": images[0].asset->url
        }`,
        { start, end },
      ),
      client.fetch(
        `count(*[_type == "product" && name match "*${sanitized}*"])`,
      ),
    ]);

    return { products, total };
  } catch {
    return { products: [], total: 0 };
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
  const { products, total } = await getData(query, currentPage);
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
          <p className="text-center text-gray-500 mt-12">
            No products found for &quot;{query}&quot;. Try a different search term.
          </p>
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
