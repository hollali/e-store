import { client } from '@/lib/sanity';
import { fullProduct } from '@/app/interface';
import ImageGallery from '@/components/imageGallery';
import { Button} from "@/components/ui/button";
import { Star, Truck } from 'lucide-react';
import AddToBag from '@/components/AddToBag';

async function getData(slug: string){
    const query = `*[_type == "product" && slug.current == "${slug}"][0]{
        _id,
          images,
          price,
          name,
          description,
          "slug": slug.current,
          "categoryName": category->name,
      }`;

    const data = await client.fetch(query);

    return data;
}
export const dynamic = "force-dynamic";

export default async function ProductPge({
    params,
}:{
    params: { slug: string };
}) {
    const data:fullProduct = await getData(params.slug);
    const cedisSign = '\u20B5';
    return (
        <div className="bg-white">
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
                        <div className='mb-6 flex item center gap-3 md:mb-10'>
                            <Button className='rounded-full gap-x-2'>
                                <span className='text-sm'>4.5</span>
                                <Star className='h-5 w-5'/>
                            </Button>
                            <span className="text-sm text-gray-500 transition duration">56 Ratings</span>
                        </div>
                        <div className='mb-4'>
                            <div className='flex items-end gap-2'>
                                <span className="text-xl font-bold text-gray-800 md:text-2xl">{cedisSign} {data.price}</span>
                                <span className="mb-0.5 text-red-500 line-through">{cedisSign} {data.price + 20}</span>
                            </div>
                            <span className='text-sm text-gray-500'>
                                Incl. Vat. shipping is different</span>
                        </div>
                        <div className="mb-6 flex items-center gap-2 text-gray-500">
                            <Truck className='h-6 w-6'/>
                            <span className="text-sm">1-3 Days delivery</span>
                        </div>
                        <div className='flex gap-2.5'>
                            <AddToBag
                                currency="USD"
                                description={data.description}
                                image={data.images[0]}
                                name={data.name}
                                price={data.price}
                                key={data._id} id={''}
                            />
                            <Button variant={"secondary"}>Checkout</Button>
                        </div>
                        <p className='mt-12 text-gray-500 tracking-wide'>
                            {data.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}