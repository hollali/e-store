import {createClient} from 'next-sanity'

export const client = createClient({
    projectId: '',
    dataset: 'production',
    apiVersion: '',
    useCdn: true,
});