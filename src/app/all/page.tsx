import { simplifiedProduct } from "@/app/interface";
import { client } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";

async function getData() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    price,
    name,
    "slug": slug.current,
    "categoryName": category->name,
    "imageUrl": images[0].asset->url
  }`;

  const data = await client.fetch(query);
  return data;
}

export const dynamic = "force-dynamic";

export default async function AllProducts() {
  const data: simplifiedProduct[] = await getData();
  const cedisSign = "\u20B5";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Our Products
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <div key={product._id} className="group relative">
              <Link href={`/product/${product.slug}`}>
                <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                  <Image
                    src={product.imageUrl}
                    alt="Product image"
                    className="w-full h-full object-cover object-center lg:h-full lg:w-full"
                    width={300}
                    height={300}
                  />
                </div>
              </Link>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-primary font-semibold">
                    <Link href={`/product/${product.slug}`} className="line-clamp-1">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.categoryName}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {cedisSign} {product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
