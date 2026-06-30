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
  title: "AfricVouge",
  description: "Discover the latest trends and timeless styles at AfricVouge",
  openGraph: {
    title: "AfricVogue",
    description: "Discover the latest trends and timeless styles at AfricVogue",
    url: "https://www.africvouge.com",
    siteName: "AfricVogue",
    images: [{ url: "https://www.africvouge.com/og-image.png" }],
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
        <head>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
        </head>
        <body className={inter.className}>
          <AppProviders>
            <Navbar />
            <ShoppingCartModal />
            {children}
          </AppProviders>
          <Footer />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
