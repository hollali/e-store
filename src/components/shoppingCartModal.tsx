import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet"
  
export default function ShoppingCartModal(){
    return(
        <Sheet defaultOpen>
    <SheetContent>
        <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
            
    </SheetContent>
        </Sheet>

    )
}