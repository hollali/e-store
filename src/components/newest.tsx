import { simplifiedProduct } from "@/app/interface";
import { client } from "@/lib/sanity";
import { ArrowRight } from "lucide-react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

async function getData() {
  const query = `*[_type == "product"][0...4] | order(_createdAt desc) {
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

export default async function Newest() {
  const data: simplifiedProduct[] = await getData();
  const cedisSign = '\u20B5';

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
                <div className="absolute top-4 right-4 flex flex-col space-y-2 lg:hidden group-hover:flex">
                  <button className="p-2 rounded-full bg-white hover:bg-gray-100">
                    <FaHeart className="text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full bg-white hover:bg-gray-100">
                    <FaShoppingCart className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
