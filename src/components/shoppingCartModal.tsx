"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    } from "@/components/ui/sheet";
    import {Button} from "@/components/ui/button";
    import Image from "next/image";
    import { useShoppingCart } from "use-shopping-cart";
    import Link from "next/link";

export default function ShoppingCartModal(){
    const {
        cartCount, 
        shouldDisplayCart, 
        handleCartClick,
        cartDetails,
        removeItem,
        totalPrice
    } 
        = useShoppingCart();
    const cedisSign = '\u20B5';
    return(
        <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
    <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
        <SheetTitle className="flex items-center justify-center h-full text-3xl text-purple-700 border-b pb-2 border-gray-200 font-bold">Cart</SheetTitle>
        </SheetHeader>
            <div className="h-full flex flex-col justify-between">
                <div className="mt-8 flex-1 overflow-y-auto">
                    <ul className="-my-6 divide-y divide-gray-200">
                        {cartCount === 0 ?(
                        <div>
                            <h1 className="mt-36 flex items-center justify-center h-full text-2xl font-semibold">
                                Your cart is empty !!
                            </h1>
                        </div>
                        ):(
                            <>
                            {Object.values(cartDetails ?? {}).map((entry) =>(
                                <li key={entry.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <Image 
                                        src={entry.image as string} 
                                        alt="Product image" 
                                        width={100} 
                                        height={100} 
                                        />
                                    </div>
                                    <div className="ml-4 flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{entry.name}</h3>
                                                <p className="ml-4">{cedisSign}{entry.price}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {entry.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <p className="text-gray-500">Quantity: {entry.quantity}</p>
                                            <div className="flex">
                                                <button type="button" 
                                                onClick={() => removeItem(entry.id)}
                                                className="font-medium text-primary hover:text-primary/80">
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
                        <p>{cedisSign}{totalPrice}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Delivery fee is not added at checkout
                    </p>
                    <div className="mt-6">
                        <Button className="w-full">Checkout</Button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                            OR{" "}
                            <button
                            onClick={() => handleCartClick()}
                            className="font-medium text-primary hover:text-primary/80">
                                Continue Shopping
                            </button>
                        </p>
                    </div>
                </div>
            </div>
    </SheetContent>
        </Sheet>
    )
}