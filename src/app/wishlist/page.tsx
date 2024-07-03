"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import sanityClient from "@sanity/client";
import { WishlistItem } from "@/app/interface";



export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        // Fetch wishlist items from Sanity
        const query = `*[_type == "product"] {_id, name, price, imageUrl, description}`;
        const products = await client.fetch(query);

        // Map the fetched data into your WishlistItem interface
        const wishlistItemsData: WishlistItem[] = products.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description,
        }));

        setWishlistItems(wishlistItemsData);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    };

    fetchWishlistItems();
  }, []);

  const removeItem = async (id: string) => {
    try {
      // Delete item from Sanity if needed
      // Example: const response = await client.delete(id);

      // Remove item from local state
      setWishlistItems(wishlistItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div>
          <h1 className="mt-36 flex items-center justify-center h-full text-2xl font-semibold">
            Your wishlist is empty!
          </h1>
          <p className="mt-2 text-center text-gray-600">
            <Link href="/">Go shopping!</Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-md shadow-md">
              <div className="h-48 w-full overflow-hidden rounded-md border border-gray-200">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex-1 flex-col">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3 className="line-clamp-1">{item.name}</h3>
                  <p className="ml-4">
                    &#8373;{item.price}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
