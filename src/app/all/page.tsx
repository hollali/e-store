import { simplifiedProduct } from "@/app/interface";
import { client } from "@/lib/sanity";
import Image from "next/image";
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
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex gap-6 flex-wrap justify-center">
          <Link
            href="/Men"
            className="relative flex h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden shadow-md group"
          >
            <Image
              src="/maleitem.png"
              alt="Men"
              fill
              className="object-cover transition group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white bg-black/40 dark:bg-black/60">
              Men
            </span>
          </Link>
          <Link
            href="/Women"
            className="relative flex h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden shadow-md group"
          >
            <Image
              src="/model.jpeg"
              alt="Women"
              fill
              className="object-cover transition group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white bg-black/40 dark:bg-black/60">
              Women
            </span>
          </Link>
          <Link
            href="/Accessories"
            className="relative flex h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden shadow-md group"
          >
            <Image
              src="/bracelets.jpeg"
              alt="Accessories"
              fill
              className="object-cover transition group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white bg-black/40 dark:bg-black/60">
              Accessories
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
