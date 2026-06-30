"use client";

import { urlFor } from "../lib/sanity";
import { ProductCart } from "./AddToBag";
import { PaystackButton } from "react-paystack";
import { useUser } from "@clerk/nextjs";

export default function CheckoutNow({
  currency,
  description,
  image,
  name,
  price,
  price_id,
}: ProductCart) {
  const { user } = useUser();

  const product = {
    name,
    description,
    price,
    currency,
    image: urlFor(image).url(),
    price_id,
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.primaryEmailAddress?.emailAddress || "customer@example.com",
    amount: product.price * 100,
    currency: "GHS",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
  };

  const componentProps = {
    ...config,
    text: "Checkout",
    onSuccess: () => {},
    onClose: () => {},
  };

  return (
    <div className="inline-block">
      <PaystackButton
        {...componentProps}
        className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-500"
      />
    </div>
  );
}
