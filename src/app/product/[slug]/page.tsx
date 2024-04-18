import { client } from '@/lib/sanity';
import { fullProduct } from '@/app/interface';
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

    const data = await client.fetch(query);
    return data;
}
export default async function ProductPage({
    params,
}:{
    params:{slug:string};
}) {
    const data:fullProduct = await getData(params.slug);
    return <h1>Hello From the Product Page</h1>;
}