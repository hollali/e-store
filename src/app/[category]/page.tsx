import { client } from "@/lib/sanity";
import { simplifiedProduct } from "../interface";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getBatchRatings } from "@/lib/ratings";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

async function getData(category: string, page: number) {
  try {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const [products, total] = await Promise.all([
      client.fetch(
        `*[_type == "product" && category->name == $category] | order(_createdAt desc)[$start...$end]{
          _id,
          "imageUrl": images[0].asset->url,
          price,
          name,
          "slug": slug.current,
          "categoryName": category->name,
          price_id
        }`,
        { start, end, category },
      ),
      client.fetch(
        `count(*[_type == "product" && category->name == $category])`,
        { category },
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

    return { products: enriched, total };
  } catch {
    return { products: [], total: 0 };
  }
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { category: string } }) {
  return {
    title: `${params.category} - AfricVogue`,
    description: `Shop our ${params.category} collection at AfricVogue. Discover the latest trends and timeless styles.`,
    openGraph: {
      title: `${params.category} - AfricVogue`,
      description: `Shop our ${params.category} collection at AfricVogue.`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { page?: string };
}) {
  const validCategories = ["Men", "Women", "Accessories"];
  if (!validCategories.includes(params.category)) {
    notFound();
  }

  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const { products, total } = await getData(params.category, currentPage);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-primary hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-gray-900">{params.category}</li>
          </ol>
        </nav>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {params.category}
          </h1>
          <p className="text-sm text-gray-500" aria-live="polite">
            {total === 0 ? "No products" : `${total} ${total === 1 ? "product" : "products"}`}
          </p>
        </div>
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">No products in this category yet.</p>
            <Link href="/all" className="mt-4 inline-block font-medium text-primary hover:underline">
              Browse all products
            </Link>
          </div>
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
          basePath={`/${params.category}`}
        />
      </div>
    </div>
  );
}
