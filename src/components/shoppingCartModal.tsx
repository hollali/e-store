"use client";

import { PaystackConsumer } from "react-paystack";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ShoppingCartModal() {
  const {
    cartCount,
    shouldDisplayCart,
    handleCartClick,
    cartDetails,
    removeItem,
    incrementItem,
    decrementItem,
    totalPrice,
    clearCart,
  } = useCart();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const cedisSign = "\u20B5";

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: user?.primaryEmailAddress?.emailAddress || "customer@example.com",
    amount: Math.round(totalPrice * 100),
    currency: "GHS",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    metadata: {
      custom_fields: [
        {
          display_name: "Total Items",
          variable_name: "total_items",
          value: cartCount,
        },
      ],
    },
  };

  async function handlePaymentSuccess() {
    const items = Object.values(cartDetails).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    if (isSignedIn) {
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderRef: paystackConfig.reference,
            total: totalPrice,
            items,
            email: paystackConfig.email,
          }),
        });
      } catch {
        // order saved locally only
      }
    }

    clearCart();
    if (isSignedIn) {
      router.push("/orders");
    }
  }

  return (
    <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
      <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-center h-full text-3xl text-primary border-b pb-2 border-gray-200 font-bold">
            Cart
          </SheetTitle>
        </SheetHeader>
        <div className="h-full flex flex-col justify-between">
          <div className="mt-8 flex-1 overflow-y-auto">
            <ul className="-my-6 divide-y divide-gray-200">
              {cartCount === 0 ? (
                <li className="mt-36 flex items-center justify-center h-full text-2xl font-semibold">
                  Your cart is empty!
                </li>
              ) : (
                <>
                  {Object.values(cartDetails ?? {}).map((entry) => (
                    <li key={entry.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={entry.image as string}
                          alt={entry.name || "Product image"}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-1">{entry.name}</h3>
                            <p className="ml-4">
                              {cedisSign}
                              {entry.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">
                            Quantity: {entry.quantity}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => decrementItem(entry.id)}
                              className="font-extrabold text-primary hover:text-primary/80"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => incrementItem(entry.id)}
                              className="font-extrabold text-primary hover:text-primary/80"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(entry.id)}
                              className="font-medium text-primary hover:text-primary/80"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal:</p>
              <p className="text-primary">
                {cedisSign}
                {totalPrice}
              </p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Delivery fee is not added at checkout
            </p>
            <div className="mt-6">
              <PaystackConsumer {...paystackConfig}>
                {({ initializePayment }) => (
                  <button
                    onClick={() => {
                      handleCartClick();
                      setTimeout(() => initializePayment(), 400);
                    }}
                    className="w-full bg-primary text-white py-2 px-4 rounded"
                  >
                    Checkout
                  </button>
                )}
              </PaystackConsumer>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                OR{" "}
                <button
                  onClick={() => handleCartClick()}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Continue Shopping
                </button>
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
