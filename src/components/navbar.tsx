"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { ShoppingBag, Menu, Heart, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { handleCartClick, cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { name: "Home", href: "/" },
    { name: "Men", href: "/Men" },
    { name: "Women", href: "/Women" },
    { name: "Accessories", href: "/Accessories" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold tracking-tight">
                Afric<span className="text-primary">Vogue</span>
              </span>
              <span className="block text-[8px] text-gray-400 tracking-[0.2em] uppercase">
                Leading Online Fashion Store
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </button>
              <Link
                href="/wishlist"
                className="hidden sm:flex items-center gap-1 text-sm text-gray-700 hover:text-primary"
              >
                <Heart size={20} />
                <span className="hidden lg:inline">Wishlist</span>
              </Link>
              <button
                onClick={() => handleCartClick()}
                className="relative flex items-center gap-1 text-sm text-gray-700 hover:text-primary"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 min-w-[16px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1">
                    {cartCount}
                  </span>
                )}
                <span className="hidden lg:inline">Cart</span>
              </button>
              <div className="hidden lg:flex items-center">
                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <Link
                    href="/sign-in"
                    className="ml-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden border-b border-gray-200 p-4">
          <div className="relative">
            <SearchBar />
          </div>
        </div>
      )}

      {/* Desktop nav */}
      <div className="border-b border-gray-200 bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center h-12 px-4 text-sm font-semibold uppercase tracking-wide text-gray-800 hover:text-primary border-b-2 border-transparent hover:border-primary transition-all ${
                    isActive ? "text-primary border-primary" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/" className="text-lg font-bold tracking-tight" onClick={() => setIsOpen(false)}>
              Afric<span className="text-primary">Vogue</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100% - 7rem)" }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-sm font-semibold uppercase text-gray-800 hover:text-primary border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
            {!isSignedIn ? (
              <Link
                href="/sign-in"
                className="block w-full text-center py-2.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-2 py-1">
                <UserButton afterSignOutUrl="/" showName />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
