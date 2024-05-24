
"use client";

import { Button } from "@/components/ui/button";
import { useShoppingCart } from "use-shopping-cart";
import { urlFor } from "../lib/sanity";
import { ProductCart } from "./AddToBag";

export default function CheckoutNow({
  currency,
  description,
  image,
  name,
  price,
  id,
}: ProductCart) {
  const { checkoutSingleItem } = useShoppingCart();

  function buyNow(Id: string) {
    checkoutSingleItem(Id);
  }

  const product = {
    name: name,
    description: description,
    price: price,
    currency: currency,
    image: urlFor(image).url(),
    id: id,
  };
  return (
    <Button
      variant="outline"
      onClick={() => {
        buyNow(product.id);
      }}
    >
      Checkout Now
    </Button>
  );
}
