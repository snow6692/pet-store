import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/Navbar";
import Alert from "@/components/Alert";
// import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pet-store-snow66926692.vercel.app"),
  title: "My Store - Pet Food & Pet Lover Community",
  description:
    "Shop premium pet food and supplies at My Store. Join our vibrant community of pet lovers to share tips, stories, and connect with fellow pet enthusiasts.",
  keywords: [
    "pet food",
    "pet supplies",
    "pet lover community",
    "squirrel food",
    "cat food",
    "bird food",
    "pet care",
    "pet store online",
    "My Store",
  ],
  openGraph: {
    title: "My Store - Pet Food & Pet Lover Community",
    description:
      "Discover high-quality pet food and connect with pet lovers at My Store. Shop now and join our community!",
    url: "https://pet-store-snow66926692.vercel.app",
    siteName: "My Store",
    images: [
      {
        url: "/bird.jpeg",
        width: 1200,
        height: 630,
        alt: "My Store Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} antialiased bg-gray-700`}>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* <Suspense
                fallback={<div className="h-16 bg-background/90 animate-pulse" />}
              > */}
              <Navbar />
              {/* </Suspense> */}
              <Alert />
              <main className="min-h-screen">{children}</main>
              <Toaster
                toastOptions={{
                  position: "top-center",
                  duration: 1500,
                  style: {
                    background: "rgba(75, 85, 99, 0.3)",
                    color: "#F3F4F6",
                    border: "1px solid rgba(96, 165, 250, 0.2)",
                    borderRadius: "8px",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
