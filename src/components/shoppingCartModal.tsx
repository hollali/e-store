"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet";
  import Image from "next/image";
  import { useShoppingCart } from "use-shopping-cart";
  
export default function ShoppingCartModal(){
    const {cartCount, shouldDisplayCart, handleCartClick, cartDetails } = useShoppingCart()
    return(
        <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
    <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
            <div className="h-full flex flex-col justify-between">
                <div className="mt-8 flex-1 overflow-y-auto">
                    <ul className="-my-6 divide-y divide-gray-200">
                        {cartCount === 0 ?(
                            <h1 className="py-6">You do not have any items here</h1>
                        ):(
                            <>
                            {Object.values(cartDetails ?? {}).map((entry) =>(
                                <li key={entry.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <Image src={entry.image as string} alt="Product image" width={100} height={100}/>
                                    </div>
                                </li>
                            ))}
                            </>
                        )}
                    </ul>
                </div>
            </div>
    </SheetContent>
        </Sheet>

    )
}