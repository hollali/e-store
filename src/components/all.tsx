import { simplifiedProduct } from "@/app/interface";
import { client } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";

async function getData() {
    const query = `*[_type == "product"] | order(_createdAt desc) {
        _id,
        price,
        name,
        "slug":slug.current,
        "categoryName": category->name,
        "imageUrl": images[0].asset->url
    }`;

    const data = await client.fetch(query);
    return data;
}

export const dynamic = "force-dynamic";

export default async function All({
    params,
}: { params: { category: string } }) {
    const data: simplifiedProduct[] = await getData();
    const cedisSign = '\u20B5';

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6  lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        <Link href="/all" className="text-primary flex items-center gap-x-1">
                            Our Products for {params.category}
                        </Link>
                    </h2>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {data.map((product) => (
                        <div key={product._id} className="group relative">
                            <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                                <Image
                                    src={product.imageUrl}
                                    alt="Product image"
                                    className="w-full h-full object-cover object-center  lg:h-full lg:w-full"
                                    width={300}
                                    height={300} />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-primary font-semibold">
                                        <Link href={`/product/${product.slug}`}>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {product.categoryName}
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{cedisSign} {product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
