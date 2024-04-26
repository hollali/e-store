"use client";

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ShoppingCartModal() {
  return (
    <Sheet>     
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div>
          <h1>Hello</h1>
        </div>
      </SheetContent>
    </Sheet>
  );
}