import {createClient} from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'rhvfdi2z',
    dataset: 'production',
    apiVersion: '2022-02-07',
    useCdn: true,
});

const builder = imageUrlBuilder(client)

export function urlFor(source:any){
    return builder.image(source);
}