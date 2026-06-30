import { client } from "@/lib/sanity";
import { simplifiedProduct } from "../interface";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

async function getData(category: string, page: number) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const [products, total] = await Promise.all([
    client.fetch(
      `*[_type == "product" && category->name == "${category}"] | order(_createdAt desc)[$start...$end]{
        _id,
        "imageUrl": images[0].asset->url,
        price,
        name,
        "slug": slug.current,
        "categoryName": category->name
      }`,
      { start, end },
    ),
    client.fetch(
      `count(*[_type == "product" && category->name == "${category}"])`,
    ),
  ]);

  return { products, total };
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
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-center items-center h-full">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Our {params.category} Product
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product: simplifiedProduct) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/${params.category}`}
        />
      </div>
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
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
