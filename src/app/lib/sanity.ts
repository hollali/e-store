import {createClient} from 'next-sanity'

export const client = createClient({
    projectId: '',
    dataset: '',
    apiVersion: '',
    useCdn: true,
})