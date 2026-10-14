import { simplifiedProduct } from "@/app/interface";
import { client } from "@/lib/sanity";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getBatchRatings } from "@/lib/ratings";

const ITEMS_PER_PAGE = 12;

async function getData(page: number) {
  try {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const [products, total] = await Promise.all([
      client.fetch(
        `*[_type == "product"] | order(_createdAt desc)[$start...$end]{
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
      client.fetch(`count(*[_type == "product"])`),
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

    return { products: enriched, total };
  } catch {
    return { products: [], total: 0 };
  }
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products - AfricVogue",
  description:
    "Browse our complete collection of African fashion products at AfricVogue.",
};

export default async function AllProducts({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const { products, total } = await getData(currentPage);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            All Products
          </h1>
          <p className="text-sm text-gray-500" aria-live="polite">
            {total === 0 ? "No products" : `${total} ${total === 1 ? "product" : "products"}`}
          </p>
        </div>
        {products.length === 0 ? (
          <p className="py-16 text-center text-gray-500">No products available yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product: simplifiedProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/all"
        />
      </div>
    </div>
  );
}
