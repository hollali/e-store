import { client } from '@/lib/sanity';
async function getData(slug: string){
    const query = `*[_type == "product" && slug.current == "${slug}[0]{
        _id,
          images,
          price,
          name,
          description,
          "slug": slug.current,
          "categoryName": category->name,
      }`;

    const data = await client.fetch(query)
}
export default function ProductPage() {
    return <h1>Hello From the Product Page</h1>;
}