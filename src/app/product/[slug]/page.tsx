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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li><Link href="/" className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Home</Link></li>
                        <li aria-hidden="true">/</li>
                        {data.categoryName && (
                            <>
                                <li><Link href={`/${data.categoryName}`} className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{data.categoryName}</Link></li>
                                <li aria-hidden="true">/</li>
                            </>
                        )}
                        <li aria-current="page" className="max-w-60 truncate font-medium text-foreground">{data.name}</li>
                    </ol>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4">
                            <ImageGallery images={data.images} productName={data.name} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                    {data.categoryName || "Product"}
                                </span>
                                {data.reviewCount > 0 && (
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {data.reviewCount} {data.reviewCount === 1 ? "review" : "reviews"}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {data.name}
                            </h1>

                            <div className="mt-3 flex items-center gap-3">
                                <StarRating rating={data.rating} size="md" />
                                <a href="#reviews" className="text-sm font-medium text-primary hover:underline">
                                    {data.reviewCount > 0 ? "Read reviews" : "Be the first to review"}
                                </a>
                            </div>

                            <div className="mt-5 flex flex-wrap items-end gap-3 border-b border-gray-100 pb-5">
                                <p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    {formatGHS(data.price)}
                                </p>
                                <span className="pb-1 text-sm text-muted-foreground">
                                    Incl. VAT · Shipping at checkout
                                </span>
                            </div>

                            <p className="mt-5 text-sm leading-7 text-gray-600">
                                {data.description}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                                    <Truck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="text-xs font-medium text-gray-700">4-6 days delivery in Ghana</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                                    <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="text-xs font-medium text-gray-700">Secure Paystack &amp; MoMo</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                                    <RotateCcw className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="text-xs font-medium text-gray-700">7-day easy returns</span>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                                <AddToBag
                                    currency="GHS"
                                    description={data.description}
                                    image={data.images[0]}
                                    name={data.name}
                                    price={data.price}
                                    price_id={data.price_id}
                                    slug={data.slug}
                                />
                                <div className="mt-3">
                                    <CheckoutNow
                                        currency="GHS"
                                        description={data.description}
                                        image={data.images[0]}
                                        name={data.name}
                                        price={data.price}
                                        price_id={data.price_id}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                            <h2 className="text-lg font-semibold text-gray-900">Product details</h2>
                            <div className="mt-4 space-y-3">
                                <details className="group rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3" open>
                                    <summary className="cursor-pointer list-none text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        Description
                                    </summary>
                                    <p className="mt-3 text-sm leading-7 text-gray-600">
                                        {data.description}
                                    </p>
                                </details>
                                <details className="group rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                                    <summary className="cursor-pointer list-none text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        Shipping &amp; delivery
                                    </summary>
                                    <p className="mt-3 text-sm leading-7 text-gray-600">Delivery within Accra in 2-4 days, nationwide in 4-6 days. Shipping fee is calculated at checkout based on location.</p>
                                </details>
                                <details className="group rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                                    <summary className="cursor-pointer list-none text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        Returns &amp; exchanges
                                    </summary>
                                    <p className="mt-3 text-sm leading-7 text-gray-600">Unworn items with tags can be returned within 7 days. Contact us on WhatsApp to start a return.</p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="reviews" className="mt-12 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                    <ReviewSection productId={data.price_id} />
                </div>
            </div>
        </div>
    );
}
