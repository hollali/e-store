import { client, urlFor } from '@/lib/sanity';
import CheckoutNow from '@/components/CheckoutNow';
import { fullProduct } from '@/app/interface';
import ImageGallery from '@/components/imageGallery';
import { Button } from "@/components/ui/button";
import { Star, Truck } from 'lucide-react';
import AddToBag from '@/components/AddToBag';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/ReviewSection';
import { notFound } from 'next/navigation';
import { getProductRating } from '@/lib/ratings';

async function getData(slug: string) {
    try {
        const query = `*[_type == "product" && (slug.current == $slug || price_id == $slug || _id == $slug)][0]{
            _id,
            images,
            price,
            name,
            description,
            "slug": slug.current,
            "categoryName": category->name,
            price_id
        }`;

        const data = await client.fetch(query, { slug });
        if (!data) return null;

        let rating = null;
        try {
            rating = data.price_id ? await getProductRating(data.price_id) : null;
        } catch {
            // ratings unavailable
        }

        return { ...data, rating: rating?.average || 0, reviewCount: rating?.count || 0 };
    } catch {
        return null;
    }
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const data: fullProduct = await getData(params.slug);
    if (!data) return { title: "Product Not Found - AfricVogue" };

    return {
        title: `${data.name} - AfricVogue`,
        description: data.description,
        openGraph: {
            title: `${data.name} - AfricVogue`,
            description: data.description,
            images: data.images?.[0] ? [{ url: urlFor(data.images[0]).url() }] : [],
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: { slug: string };
}) {
    const data: any = await getData(params.slug);
    if (!data) notFound();

    const cedisSign = '\u20B5';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'GHS',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <div className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
                <div className='grid gap-8 md:grid-cols-2'>
                    <ImageGallery images={data.images} />
                    <div className='md:py-8'>
                        <div className="mb-2 md:mb-3">
                            <span className='mb-0.5 inline-block text-gray-500'>{data.categoryName}</span>
                            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                                {data.name}
                            </h2>
                        </div>
                        <div className='mb-6 flex items-center gap-3 md:mb-10'>
                            <StarRating rating={data.rating} size="lg" />
                            <span className="text-sm text-gray-500">{data.reviewCount} {data.reviewCount === 1 ? 'Rating' : 'Ratings'}</span>
                        </div>
                        <div className='mb-4'>
                            <div className='flex items-end gap-2'>
                                <span className="text-xl font-bold text-gray-800 md:text-2xl">{cedisSign} {data.price}</span>
                            </div>
                            <span className='text-sm text-gray-500'>
                                Incl. VAT. Shipping is different
                            </span>
                        </div>
                        <div className="mb-6 flex items-center gap-2 text-gray-500">
                            <Truck className='h-6 w-6' />
                            <span className="text-sm">4-6 Days delivery</span>
                        </div>
                        <div className='flex gap-2.5'>
                            <AddToBag
                                currency="GHS"
                                description={data.description}
                                image={data.images[0]}
                                name={data.name}
                                price={data.price}
                                key={data._id}
                                price_id={data.price_id}
                                slug={data.slug}
                            />
                            <CheckoutNow
                                currency="GHS"
                                description={data.description}
                                image={data.images[0]}
                                name={data.name}
                                price={data.price}
                                key={data._id}
                                price_id={data.price_id}
                            />
                        </div>
                        <p className='mt-12 text-gray-500 tracking-wide'>
                            {data.description}
                        </p>
                    </div>
                </div>
                <ReviewSection productId={data.price_id} />
            </div>
        </div>
    );
}
