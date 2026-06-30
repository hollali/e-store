import { simplifiedProduct } from "@/app/interface";
import Image from "next/image";
import Link from "next/link";

const cedisSign = "\u20B5";

export default function ProductCard({ product }: { product: simplifiedProduct }) {
  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
          <Image
            src={product.imageUrl}
            alt={product.name}
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
          <p className="mt-1 text-sm text-gray-500">{product.categoryName}</p>
          <p className="text-sm font-medium text-gray-900">
            {cedisSign} {product.price}
          </p>
        </div>
      </div>
    </div>
  );
}
