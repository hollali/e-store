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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
         <link rel="apple-touch-icon" href="/favicon.png<generated>" type="image/<generated> "sizes="<generated>" />
        <meta property="og:title" content="AfricVogue" />
        <meta property="og:description" content="Discover the latest trends and timeless styles at AfricVogue" />
        <meta property="og:image" content="https://www.africvouge.com/favicon.ico" />
        <meta property="og:url" content="https://www.africvouge.com" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "https://www.africvogue.com",
              "logo": "https://www.africvogue.com/favicon.ico"
            })
          }}
        />
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
