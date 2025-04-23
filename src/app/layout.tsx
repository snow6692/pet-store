import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/Navbar";
import { cachedUser } from "@/lib/cache/user.cache";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    url: "https://www.mystore.com", // Replace with your actual domain
    siteName: "My Store",
    images: [
      {
        url: "/squirrel.jpeg",
        width: 1200,
        height: 630,
        alt: "My Store Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Store - Pet Food & Pet Lover Community",
    description:
      "Shop premium pet food and join our pet lover community at My Store!",
    images: ["/squirrel.jpeg"],
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
  const user = await cachedUser();

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "My Store",
    url: "https://www.mystore.com", // Replace with your actual domain
    description:
      "My Store offers premium pet food and supplies, and a community for pet lovers to connect and share.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.mystore.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-gray-700`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar user={user} />
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
      </body>
    </html>
  );
}
