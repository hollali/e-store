export interface simplifiedProduct {
    _id: string;
    imageUrl: string;
    price: number;
    slug: string;
    categoryName:string;
    name: string;
    price_id?: string;
    rating?: number;
    reviewCount?: number;
}

export interface fullProduct {
    _id: string;
    images: any;
    price: number;
    slug: string;
    categoryName:string;
    name: string;
    description: string;
    price_id:string;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    productId: string;
    rating: number;
    title: string | null;
    body: string | null;
    createdAt: string;
}
