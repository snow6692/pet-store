import ProductHomePagination from "@/components/pagination/ProductHomePagination";
import ProductList from "@/components/ProductList";
import { getCachedProducts } from "@/lib/cache/product.cache";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";

async function ProductPage({ params }: { params: Promise<{ page: string }> }) {
  const page = parseInt((await params).page);
  const limit = 10;

  const data = await getCachedProducts(page, limit);
  if (!data || !data.products || data.products.length === 0) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary transition-all duration-300">
              Explore Our Products
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto transition-opacity duration-300">
              Discover our curated selection of high-quality products tailored
              to your needs.
            </p>
          </div>

          {/* Product List */}
          <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <Suspense fallback={<ProductList.Skeleton />}>
                <ProductList products={data.products} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <Suspense
              fallback={
                <p className="text-muted-foreground transition-opacity duration-300">
                  Loading pagination...
                </p>
              }
            >
              <ProductHomePagination page={page} totalPages={data.pages} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
