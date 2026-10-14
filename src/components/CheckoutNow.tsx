"use client";

import { useState } from "react";
import { urlFor } from "../lib/sanity";
import { ProductCart } from "./AddToBag";
import { PaystackButton } from "react-paystack";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CheckoutNow({
  currency,
  description,
  image,
  name,
  price,
  price_id,
}: ProductCart) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

  const config = {
    reference: `av-buynow-${Date.now()}`,
    email,
    amount: Math.round(price * 100),
    currency: "GHS",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
  };

  async function persistOrder(orderRef: string) {
    if (!isSignedIn) return;
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef,
          total: price,
          items: [{ id: price_id, name, price, quantity: 1 }],
          email,
        }),
      });
    } catch {
      // order history is best-effort for buy-now
    }
  }

  const componentProps = {
    ...config,
    text: "Buy Now",
    onSuccess: async (ref: any) => {
      const orderRef = ref?.reference ?? config.reference;
      await persistOrder(orderRef);
      if (isSignedIn) router.push("/orders");
    },
    onClose: () => {},
  };

  if (!hasPublicKey || !email) {
    return (
      <div className="inline-block">
        <button
          type="button"
          disabled
          title={!email ? "Sign in to use Buy Now (we need an email for receipt)" : "Payment not configured"}
          className="h-11 cursor-not-allowed rounded-md border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-400"
        >
          Buy Now
        </button>
        {!email && (
          <p className="mt-1 text-xs text-gray-500">Sign in to use Buy Now.</p>
        )}
      </div>
    );
  }

  return (
    <div className="inline-block">
      {error && (
        <p role="alert" className="mb-1 text-xs text-red-600">
          {error}
        </p>
      )}
      <PaystackButton
        {...componentProps}
        onSuccess={(ref: any) => {
          setError("");
          componentProps.onSuccess(ref);
        }}
        onClose={() => {}}
        className="h-11 rounded-md border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
      <span className="sr-only">
        Buy {name} now for {price} {currency}. {description}
      </span>
    </div>
  );
}
