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

  // Paystack configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: "user@example.com", // Replace with user's email
    amount: product.price * 100, // Paystack works with amounts in cedis
    currency: "GHS",
    publicKey: "your-paystack-public-key", // Replace with your Paystack public key
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
    text: "Pay with Paystack",
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => {
          buyNow(product.id);
        }}
      >
        Checkout Now
      </Button>
      <PaystackButton {...componentProps} />
    </div>
  );
}
