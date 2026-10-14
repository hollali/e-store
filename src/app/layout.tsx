import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AppProviders from "@/components/provider";
import ShoppingCartModal from "@/components/shoppingCartModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AfricVogue",
  description: "Discover the latest trends and timeless styles at AfricVogue",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "AfricVogue",
    description: "Discover the latest trends and timeless styles at AfricVogue",
    url: "https://www.africvogue.com",
    siteName: "AfricVogue",
    images: [{ url: "https://www.africvogue.com/og-image.png" }],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfricVogue",
    description: "Discover the latest trends and timeless styles at AfricVogue",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to content
          </a>
          <AppProviders>
            <Navbar />
            <ShoppingCartModal />
            <main id="main-content">{children}</main>
          </AppProviders>
          <Footer />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
