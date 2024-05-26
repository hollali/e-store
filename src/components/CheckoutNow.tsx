"use client";

import { Button } from "@/components/ui/button";
import { useShoppingCart } from "use-shopping-cart";
import { urlFor } from "../lib/sanity";
import { ProductCart } from "./AddToBag";
import { PaystackButton } from "react-paystack";

export default function CheckoutNow({
  currency,
  description,
  image,
  name,
  price,
  price_id,
}: ProductCart) {
  const { checkoutSingleItem } = useShoppingCart();

  function buyNow(priceId: string) {
    checkoutSingleItem(priceId);
  }

  const product = {
    name: name,
    description: description,
    price: price,
    currency: currency,
    image: urlFor(image).url(),
    price_id: price_id,
  };

  // Paystack configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: "user@example.com", // Replace with user's email
    amount: product.price * 100, // Paystack works with amounts in cedis
    currency: "GHS",
    publicKey: "pk_live_28d0821e0513a70cdf1bd69001dac6f723d93d40", // Replace with your Paystack public key
  };

  const handlePaystackSuccessAction = (reference: any) => {
    // Implement what happens when the payment is successful
    console.log(reference);
  };

  const handlePaystackCloseAction = () => {
    // Implement what happens when the payment is closed
    console.log("Payment closed");
  };

  const componentProps = {
    ...config,
    text: "Checkout",
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <div className="inline-block">
      <PaystackButton {...componentProps} 
      className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-500"/>
    </div>
  );
}
