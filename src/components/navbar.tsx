"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { ShoppingBag, Menu, Search, Heart, Package, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { handleCartClick, cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Men", href: "/Men" },
    { name: "Women", href: "/Women" },
    { name: "Accessories", href: "/Accessories" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 mb-8 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-sm"
          : "bg-white dark:bg-gray-950"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile: hamburger */}
          <button
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              Afric<span className="text-primary">Vogue</span>
            </h1>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search (desktop only) */}
            <div className="hidden lg:relative lg:flex lg:items-center">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5" />
              </button>
              <form
                onSubmit={handleSearch}
                className={`absolute right-0 top-full mt-2 flex items-center transition-all duration-200 origin-top-right ${
                  searchOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-56 sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>

            {/* Wishlist icon */}
            {isSignedIn && (
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => handleCartClick()}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-4 w-4 min-w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User (desktop only) */}
            <div className="hidden lg:flex items-center">
              {isSignedIn ? (
                <div className="ml-1">
                  <UserButton afterSignOutUrl="/" />
                </div>
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

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in menu (left side) */}
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[80vw] bg-white dark:bg-gray-950 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile search */}
          <div className="p-4 border-b dark:border-gray-800">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}

              {/* Divider */}
              <li className="pt-4 mt-4 border-t dark:border-gray-800">
                <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Account
                </span>
              </li>

              {isSignedIn ? (
                <>
                  <li>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Heart className="h-4 w-4" /> Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Package className="h-4 w-4" /> Orders
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      <User className="h-4 w-4 shrink-0" />
                      <UserButton afterSignOutUrl="/" showName />
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User className="h-4 w-4" /> Sign in
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
