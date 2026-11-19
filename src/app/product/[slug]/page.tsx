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
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

    const images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];

    return {
        title: `${data.name} - AfricVogue`,
        description: data.description,
        openGraph: {
            title: `${data.name} - AfricVogue`,
            description: data.description,
            images: images[0] ? [{ url: urlFor(images[0]).url() }] : [],
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

    const images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
    const primaryImage = images[0];
    const productKey = data.price_id || data._id;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: primaryImage ? urlFor(primaryImage).url() : undefined,
        offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'GHS',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <div className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
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
                        <Card className="p-3 sm:p-4">
                            <ImageGallery images={images} productName={data.name} />
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 sm:p-8">
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

                            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                                {data.name}
                            </h1>

                            <div className="mt-3 flex items-center gap-3">
                                <StarRating rating={data.rating} size="md" />
                                <a href="#reviews" className="text-sm font-medium text-primary hover:underline">
                                    {data.reviewCount > 0 ? "Read reviews" : "Be the first to review"}
                                </a>
                            </div>

                            <div className="mt-5 flex flex-wrap items-end gap-3 border-b border-border pb-5">
                                <p className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                    {formatGHS(data.price)}
                                </p>
                                <span className="pb-1 text-sm text-muted-foreground">
                                    Incl. VAT · Shipping at checkout
                                </span>
                            </div>

                            <p className="mt-5 max-w-prose text-sm leading-7 text-muted-foreground">
                                {data.description}
                            </p>

                            <div className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
                                <div className="flex items-center gap-3 sm:pr-4">
                                    <Truck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="text-xs font-medium text-foreground">4-6 days delivery in Ghana</span>
                                </div>
                                <div className="flex items-center gap-3 sm:px-4">
                                    <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="text-xs font-medium text-foreground">Secure Paystack &amp; MoMo</span>
                                </div>
                                <div className="flex items-center gap-3 sm:pl-4">
                                    <RotateCcw className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="text-xs font-medium text-foreground">7-day easy returns</span>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
                                <AddToBag
                                    currency="GHS"
                                    description={data.description}
                                    image={primaryImage}
                                    name={data.name}
                                    price={data.price}
                                    price_id={productKey}
                                    slug={data.slug}
                                />
                                <div className="mt-4">
                                    <CheckoutNow
                                        currency="GHS"
                                        description={data.description}
                                        image={primaryImage}
                                        name={data.name}
                                        price={data.price}
                                        price_id={productKey}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 sm:p-8">
                            <h2 className="font-serif text-xl font-semibold text-foreground">Product details</h2>
                            <Accordion type="single" collapsible className="mt-4">
                                <AccordionItem value="shipping" className="border-border">
                                    <AccordionTrigger className="text-sm text-foreground hover:text-primary hover:no-underline">
                                        Shipping &amp; delivery
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Delivery within Accra in 2-4 days, nationwide in 4-6 days. Shipping fee is calculated at checkout based on location.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="returns" className="border-border">
                                    <AccordionTrigger className="text-sm text-foreground hover:text-primary hover:no-underline">
                                        Returns &amp; exchanges
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Unworn items with tags can be returned within 7 days. Contact us on WhatsApp to start a return.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </Card>
                    </div>
                </div>

                <Card id="reviews" className="mt-12 scroll-mt-24 p-6 sm:p-8">
                    <ReviewSection productId={productKey} />
                </Card>
            </div>
        </div>
    );
}
