import { simplifiedProduct } from "@/app/interface";
import { client } from "@/lib/sanity";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

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
          "imageUrl": images[0].asset->url
        }`,
        { start, end },
      ),
      client.fetch(`count(*[_type == "product"])`),
    ]);

    return { products, total };
  } catch {
    return { products: [], total: 0 };
  }
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products - AfricVogue",
  description: "Browse our complete collection of African fashion products at AfricVogue.",
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
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Our Products
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
          basePath="/all"
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
