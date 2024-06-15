import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartProvider from "@/components/provider";
import ShoppingCartModal from "@/components/shoppingCartModal";
import Head from 'next/head';

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
      <Head>
        <link rel="icon" href="favicon.ico" />
        <meta property="og:title" content="AfricVogue" />
        <meta property="og:description" content="Discover the latest trends and timeless styles at AfricVouge" />
        <meta property="og:image" content="https://www.africvouge.com/path-to-your-logo-image.jpg" />
        <meta property="og:url" content="https://www.africvouge.com" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "url": "https://www.africvouge.com",
          "logo": "https://www.africvouge.com/path-to-your-logo-image.jpg"
        }) }} />
      </Head>
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <ShoppingCartModal />
          {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
