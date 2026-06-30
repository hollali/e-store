import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rhvfdi2z',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2022-02-07',
    useCdn: true,
});

const builder = imageUrlBuilder(client)

export function urlFor(source : any){
    return builder.image(source);
}