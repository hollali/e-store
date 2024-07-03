"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@/components/ui/button";
import { useShoppingCart } from "use-shopping-cart";

const links = [
  { name: "Home", href: "/" },
  { name: "Men", href: "/Men" },
  { name: "Women", href: "/Women" },
  { name: "Accessories", href: "/Accessories" },
  { name: "Sign up", href: "/sign-up" },
  { name: "Wishlist", href: "/wishlist", isMobileOnly: true }, // Add isMobileOnly flag
];

export default function Navbar() {
  const pathname = usePathname();
  const { handleCartClick, cartCount = 0 } = useShoppingCart(); // Default to 0 if cartCount is undefined
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="mb-8 border-b">
      <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl">
        <button
          className="lg:hidden z-50 p-2 mr-4 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon />
        </button>
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg transform transition-transform duration-300 z-40 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <nav>
              <ul className="mt-10">
                {links.map((link, idx) => (
                  <div key={idx}>
                    {!link.isMobileOnly && (
                      <>
                        <li className="my-4">
                          <Link href={link.href}>
                            <span onClick={() => setIsOpen(false)}>{link.name}</span>
                          </Link>
                        </li>
                        {idx < links.length - 1 && <hr className="border-gray-200" />}
                      </>
                    )}
                  </div>
                ))}
                {/* Add wishlist link conditionally for mobile */}
                <li className="my-4 lg:hidden">
                  <Link href="/wishlist">
                    <span onClick={() => setIsOpen(false)}>Wishlist</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-bold">
            Afric<span className="text-primary">Vogue</span>
          </h1>
        </Link>
        <nav className="hidden gap-12 lg:flex">
          {links
            .filter((link) => !link.isMobileOnly)
            .map((link, idx) => (
              <div key={idx}>
                {pathname === link.href ? (
                  <Link href={link.href} className="text-lg font-semibold text-primary">
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    href={link.href}
                    className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
        </nav>
        <div className="flex items-center divide-x border-r sm:border-l">
          <Button
            variant="outline"
            onClick={() => handleCartClick()}
            className="flex flex-col gap-y-1.5 h-12 w-12 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-none relative"
          >
            <ShoppingBagIcon />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs">
                {cartCount}
              </span>
            )}
            <span className="hidden text-xs font-semibold text-gray-500 sm:block">
              Cart
            </span>
          </Button>
          <Button
            variant="outline"
            className="hidden lg:flex flex-col gap-y-1.5 h-12 w-12 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-none relative"
          >
            <FavoriteBorderIcon />
            <span className="hidden text-xs font-semibold text-gray-500 sm:block">
              Wishlist
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
