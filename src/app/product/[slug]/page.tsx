import { client, urlFor } from '@/lib/sanity';
import CheckoutNow from '@/components/CheckoutNow';
import { fullProduct } from '@/app/interface';
import ImageGallery from '@/components/imageGallery';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import AddToBag from '@/components/AddToBag';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/ReviewSection';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductRating } from '@/lib/ratings';
import { formatGHS } from '@/lib/utils';

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

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.images?.[0] ? urlFor(data.images[0]).url() : undefined,
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
                <nav aria-label="Breadcrumb" className="py-4 text-sm text-gray-500">
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li><Link href="/" className="rounded-sm hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Home</Link></li>
                        <li aria-hidden="true">/</li>
                        {data.categoryName && (
                            <>
                                <li><Link href={`/${data.categoryName}`} className="rounded-sm hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{data.categoryName}</Link></li>
                                <li aria-hidden="true">/</li>
                            </>
                        )}
                        <li aria-current="page" className="max-w-60 truncate font-medium text-gray-900">{data.name}</li>
                    </ol>
                </nav>
                <div className='grid gap-8 pb-8 md:grid-cols-2'>
                    <ImageGallery images={data.images} productName={data.name} />
                    <div className='md:py-2'>
                        <div className="mb-2 md:mb-3">
                            <span className='mb-1 inline-block text-sm uppercase tracking-wide text-gray-500'>{data.categoryName}</span>
                            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                                {data.name}
                            </h1>
                        </div>
                        <div className='mb-4 flex items-center gap-2'>
                            <StarRating rating={data.rating} size="md" />
                            <span className="text-sm text-gray-500">
                                {data.reviewCount > 0
                                    ? `${data.reviewCount} ${data.reviewCount === 1 ? 'review' : 'reviews'}`
                                    : 'No reviews yet'}
                            </span>
                        </div>
                        <div className='mb-4'>
                            <p className="text-2xl font-bold text-gray-900 md:text-3xl">{formatGHS(data.price)}</p>
                            <span className='text-sm text-gray-500'>
                                Incl. VAT. Shipping calculated at checkout.
                            </span>
                        </div>
                        <div className="mb-6 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Truck className='h-5 w-5 shrink-0' aria-hidden="true" />
                                <span>4-6 days delivery within Ghana</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className='h-5 w-5 shrink-0' aria-hidden="true" />
                                <span>Secure payment via Paystack &amp; MTN MoMo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw className='h-5 w-5 shrink-0' aria-hidden="true" />
                                <span>Easy returns within 7 days</span>
                            </div>
                        </div>
                        <div className='flex flex-wrap items-start gap-2.5'>
                            <div className="w-full sm:flex-1">
                                <AddToBag
                                    currency="GHS"
                                    description={data.description}
                                    image={data.images[0]}
                                    name={data.name}
                                    price={data.price}
                                    price_id={data.price_id}
                                    slug={data.slug}
                                />
                            </div>
                            <CheckoutNow
                                currency="GHS"
                                description={data.description}
                                image={data.images[0]}
                                name={data.name}
                                price={data.price}
                                price_id={data.price_id}
                            />
                        </div>
                        <div className="mt-8 space-y-3">
                            <div>
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Description</h2>
                                <p className='mt-2 text-sm leading-relaxed text-gray-600'>
                                    {data.description}
                                </p>
                            </div>
                            <details className="group rounded-lg border border-gray-200 px-4 py-3">
                                <summary className="cursor-pointer text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">Shipping &amp; delivery</summary>
                                <p className="mt-2 text-sm text-gray-600">Delivery within Accra in 2-4 days, nationwide in 4-6 days. Shipping fee is calculated at checkout based on location.</p>
                            </details>
                            <details className="group rounded-lg border border-gray-200 px-4 py-3">
                                <summary className="cursor-pointer text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">Returns &amp; exchanges</summary>
                                <p className="mt-2 text-sm text-gray-600">Unworn items with tags can be returned within 7 days. Contact us on WhatsApp to start a return.</p>
                            </details>
                        </div>
                    </div>
                </div>
                <ReviewSection productId={data.price_id} />
            </div>
        </div>
    );
}
