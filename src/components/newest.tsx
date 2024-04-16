async function getData() {
    const query = `*[_type == "product"][0...4] | order(_createdAt desc) {
        _id,
        price,
        name,
        "slug":slug.current,
        "categoryName": category->name,
        "imageUrl": images[0].assets->url
    }`;
}

export default function Newest () {}