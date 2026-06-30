"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderRef: string;
  total: string;
  items: string;
  email: string;
  createdAt: string;
  status: string;
}

export default function OrdersPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isSignedIn, isLoaded, router]);

  const cedisSign = "\u20B5";

  if (!isLoaded || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <p className="text-center text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            My Orders
          </h2>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders yet</p>
            <Link
              href="/all"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items: OrderItem[] = JSON.parse(order.items);
              return (
                <div
                  key={order.id}
                  className="border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order Ref:{" "}
                        <span className="font-mono">{order.orderRef}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-GH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm mb-2"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {cedisSign} {item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      {cedisSign} {order.total}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
