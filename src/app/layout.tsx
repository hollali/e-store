import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartProvider from "@/components/provider";
import ShoppingCartModal from "@/components/shoppingCartModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AfricVouge",
  description: "Discover the latest trends and timeless styles at AfricVouge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <ShoppingCartModal />
          {children}
        </CartProvider>
        <Footer/>
      </body>
    </html>
  );
}
