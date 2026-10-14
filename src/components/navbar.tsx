"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { ShoppingBag, Menu, Heart, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { handleCartClick, cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
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
    { name: "All Products", href: "/all" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>

            <Link
              href="/"
              className="flex-shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-2xl font-bold tracking-tight">
                Afric<span className="text-primary">Vogue</span>
              </span>
              <span className="block text-[10px] text-gray-500 tracking-[0.2em] uppercase">
                Leading Online Fashion Store
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-expanded={searchOpen}
                aria-label={searchOpen ? "Close search" : "Open search"}
              >
                <Search size={20} aria-hidden="true" />
              </button>
              <Link
                href="/wishlist"
                aria-label={wishlistItems.length > 0 ? `Wishlist, ${wishlistItems.length} items` : "Wishlist"}
                className="relative flex h-11 min-w-11 items-center justify-center gap-1 rounded-md px-2 text-sm text-gray-700 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Heart size={20} aria-hidden="true" />
                {wishlistItems.length > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0.5 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                  >
                    {wishlistItems.length}
                  </span>
                )}
                <span className="hidden lg:inline">Wishlist</span>
              </Link>
              <button
                type="button"
                onClick={() => handleCartClick()}
                aria-label={cartCount > 0 ? `Open cart, ${cartCount} items` : "Open cart"}
                className="relative flex h-11 min-w-11 items-center justify-center gap-1 rounded-md px-2 text-sm text-gray-700 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ShoppingBag size={20} aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0.5 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                  >
                    {cartCount}
                  </span>
                )}
                <span className="hidden lg:inline" aria-hidden="true">
                  Cart
                </span>
              </button>
              <div className="hidden lg:flex items-center">
                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <Link
                    href="/sign-in"
                    className="ml-1 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
        <div className="border-b border-gray-200 p-4 md:hidden">
          <SearchBar onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Desktop nav */}
      <div className="border-b border-gray-200 bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center" aria-label="Primary">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-12 items-center px-4 text-sm font-semibold uppercase tracking-wide text-gray-800 transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary border-b-2 ${
                    isActive ? "border-primary text-primary" : "border-transparent"
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
      <div id="mobile-menu" className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute inset-y-0 left-0 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/" className="text-lg font-bold tracking-tight" onClick={() => setIsOpen(false)}>
              Afric<span className="text-primary">Vogue</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="px-4 py-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100% - 7rem)" }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="block rounded-md py-3 px-2 text-sm font-semibold uppercase text-gray-800 hover:bg-gray-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/wishlist"
              className="block rounded-md py-3 px-2 text-sm font-semibold uppercase text-gray-800 hover:bg-gray-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Wishlist{wishlistItems.length > 0 ? ` (${wishlistItems.length})` : ""}
            </Link>
            <Link
              href="/orders"
              className="block rounded-md py-3 px-2 text-sm font-semibold uppercase text-gray-800 hover:bg-gray-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Orders
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
            {!isSignedIn ? (
              <Link
                href="/sign-in"
                className="flex h-11 w-full items-center justify-center rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
