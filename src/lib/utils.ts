import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGHS(value: number): string {
  if (!Number.isFinite(value)) return "GH₵ 0.00";
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);
}

export function getProductId(product: { price_id?: string; _id: string }): string {
  return product.price_id || product._id;
}

export function getCartItemId(productId: string, size?: string | null): string {
  return size ? `${productId}-${size}` : productId;
}
