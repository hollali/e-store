"use client";

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { urlFor } from '../lib/sanity';
import { Heart } from 'lucide-react';

export interface ProductCart {
    name: string;
    description: string;
    price: number;
    currency: string;
    image: any;
    price_id: string;
}

export default function AddToBag({
    currency,
    description,
    image,
    name,
    price,
    price_id,
}: ProductCart) {
    const { addItem, handleCartClick, cartDetails } = useCart();
    const { isInWishlist, toggleItem } = useWishlist();
    const inWishlist = isInWishlist(price_id);
    const imageUrl = urlFor(image).url();

    const product = {
        id: price_id,
        name,
        description,
        price,
        currency,
        image: imageUrl,
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={() => {
                    addItem(product);
                    handleCartClick();
                }}
            >
                Add To Cart
            </Button>
            <button
                onClick={() =>
                    toggleItem({ id: price_id, name, price, image: imageUrl })
                }
                className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
                <Heart
                    className={`h-5 w-5 ${
                        inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
                    }`}
                />
            </button>
        </div>
    );
}
