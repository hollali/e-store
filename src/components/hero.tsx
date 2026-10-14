import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "../lib/sanity";

async function getData() {
  try {
    const query = "*[_type == 'heroImage'][0]";
    return await client.fetch(query);
  } catch {
    return null;
  }
}

export default async function Hero() {
  const data = await getData();

  if (!data?.image1) {
    return (
      <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
        <div className="mb-8 flex flex-wrap justify-between md:mb-16">
          <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl">
              Top Fashion for an Affordable Price!
            </h1>
            <p className="max-w-md leading-relaxed text-gray-500 xl:text-lg">
              We sell only the most exclusive and high quality products for you.
              We are the best so come and shop with us.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/all"
                className="inline-flex h-12 items-center rounded-md bg-primary px-6 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Shop Now
              </Link>
              <Link
                href="/Women"
                className="inline-flex h-12 items-center rounded-md border border-gray-300 px-6 text-sm font-semibold text-gray-900 hover:border-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Shop Women
              </Link>
            </div>
          </div>
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
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      <div className="mb-8 flex flex-wrap justify-between md:mb-16">
        <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl">
            Top Fashion for an Affordable Price!
          </h1>
          <p className="max-w-md leading-relaxed text-gray-500 xl:text-lg">
            We sell only the most exclusive and high quality products for you.
            We are the best so come and shop with us.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/all"
              className="inline-flex h-12 items-center rounded-md bg-primary px-6 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Shop Now
            </Link>
            <Link
              href="/Women"
              className="inline-flex h-12 items-center rounded-md border border-gray-300 px-6 text-sm font-semibold text-gray-900 hover:border-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Shop Women
            </Link>
          </div>
        </div>
        <div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
          <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
            <Image
              src={urlFor(data.image1).url()}
              alt="Model wearing AfricVogue featured collection"
              className="h-full w-full object-cover object-center"
              width={500}
              height={500}
              sizes="(max-width: 768px) 80vw, 40vw"
              priority
            />
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <Image
              src={urlFor(data.image2).url()}
              alt="AfricVogue seasonal fashion showcase"
              className="h-full w-full object-cover object-center"
              width={500}
              height={500}
              sizes="(max-width: 768px) 80vw, 40vw"
            />
          </div>
        </div>
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
    </section>
  );
}
