"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { formatGHS } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = !!session?.user;
  const isLoaded = !isPending;
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

  if (!isLoaded || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="mt-8 space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <span className="sr-only">Loading orders…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            My Orders
          </h2>
        </div>
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" aria-hidden="true" />
            <p className="font-serif text-xl text-foreground">No orders yet</p>
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
              let items: OrderItem[] = [];
              try {
                items = JSON.parse(order.items);
                if (!Array.isArray(items)) items = [];
              } catch {
                items = [];
              }
              const status = (order.status || "paid").toLowerCase();
              const statusLabel = order.status?.trim() || "Paid";
              const statusStyles =
                status === "paid" || status === "completed" || status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : status === "pending" || status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-muted text-muted-foreground";
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border p-6">
                    <div>
                      <CardTitle className="text-lg">
                        Order <span className="font-mono text-sm font-normal text-muted-foreground">{order.orderRef}</span>
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Placed {new Date(order.createdAt).toLocaleDateString("en-GH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles}`}>
                      {statusLabel}
                    </span>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {item.name} <span aria-label={`quantity ${item.quantity}`}>x{item.quantity}</span>
                          </span>
                          <span className="font-medium text-foreground">
                            {formatGHS(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="justify-between border-t border-border px-6 py-4">
                    <span className="eyebrow">Total</span>
                    <span className="font-serif text-xl font-semibold text-primary">
                      {formatGHS(Number(order.total))}
                    </span>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
