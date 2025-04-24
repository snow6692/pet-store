// export const dynamic = "force-static";

import { getRelatedProducts } from "@/actions/product.action";
import ProductCard from "@/components/cards/ProductCard";
import ProductCardSkeleton from "@/components/cards/ProductCardSkeleton";
import RatingForm from "@/components/forms/RatingForm";
import ProductDetails from "@/components/ProductDetails";
import RatingList from "@/components/RatingList";
import { getCachedProducts } from "@/lib/cache/product.cache";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

async function getProductBySlug(slug: string) {
  const data = await getCachedProducts();
  if (!data || !data.products) return null;

  return data.products.find((product) => product.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }

  return {
    title: product.name,
    description: product.description,
    image: product.images?.[0] || "/default-image.jpg",
    url: `/products/${product.slug}`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images?.[0] || "/default.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.images?.[0] || "/default.jpg"],
    },
  };
}

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-red-600">
            Product Not Found
          </h1>
          <p className="text-lg text-center text-muted-foreground mt-4">
            We are sorry, but the product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Product Details */}
        <section>
          <ProductDetails product={product} />
        </section>

        {/* Related Products */}
        <section>
          <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Related Products
              </CardTitle>
              <p className="text-muted-foreground">
                Explore more items in the {product.category.name} category
              </p>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {(await getRelatedProducts(product.category.name, product.id))
                    .length > 0 ? (
                    (
                      await getRelatedProducts(
                        product.category.name,
                        product.id
                      )
                    ).map((product) => (
                      <div
                        key={product.id}
                        className="transition-transform duration-300 hover:scale-105"
                      >
                        <ProductCard product={product} />
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-full text-center text-lg">
                      No related products found.
                    </p>
                  )}
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </section>

        {/* Rating Form */}
        <section>
          <RatingForm productId={product.id} />
        </section>

        {/* Rating List */}
        <section>
          <Suspense
            fallback={
              <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
                <CardContent className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground mt-3 text-lg">
                    Loading ratings...
                  </p>
                </CardContent>
              </Card>
            }
          >
            <RatingList productId={product.id} />
          </Suspense>
        </section>

        <Separator className="my-8 bg-gradient-to-r from-muted/30 to-muted/50" />
      </div>
    </div>
  );
}

export default ProductPage;
