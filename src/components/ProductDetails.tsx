import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import AddToCartButton from "./buttons/AddToCartButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductImageSelector from "./ProductImageSelector";

function ProductDetails({ product }: { product: ProductWithCategoriesTable }) {
  const averageRating = product.rating ?? 0;
  // Treat discount as a percentage (e.g., 20 means 20% off)
  const discountPercentage = product.discount || 0;
  const discountedPrice = discountPercentage
    ? product.price * (1 - Math.min(discountPercentage, 100) / 100)
    : product.price;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
          index < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground/50"
        )}
      />
    ));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Image Section */}
          <div className="flex flex-col items-center md:sticky md:top-24">
            <div className="relative w-full max-w-lg group">
              <div className="rounded-lg overflow-hidden shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                <ProductImageSelector images={product.images || []} />
              </div>
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold px-3 py-1 scale-100 transition-transform duration-300 group-hover:scale-105">
                  {Math.round(discountPercentage)}% OFF
                </Badge>
              )}
              {product.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-semibold px-3 py-1">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Details Section */}
          <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {product.name}
                </CardTitle>
                {product.quantity > 0 && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    In Stock: {product.quantity}
                  </Badge>
                )}
              </div>
              {product.brand && (
                <p className="text-lg text-muted-foreground mt-1">
                  {product.brand}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating */}
              <div className="group flex items-center gap-2">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="text-sm text-muted-foreground">
                  ({averageRating.toFixed(1)})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  ${discountedPrice.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line mt-2">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Category
                </h3>
                <Badge
                  variant="secondary"
                  className="mt-2 text-sm font-medium px-4 py-1.5 bg-muted hover:bg-muted/80 transition-colors duration-300 cursor-pointer"
                >
                  {product.category.name}
                </Badge>
              </div>

              {/* Stock and Add to Cart */}
              <div className="pt-4 space-y-4">
                {product.quantity === 0 ? (
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground border-muted-foreground/50 hover:bg-muted/50 transition-colors duration-300"
                    disabled
                  >
                    Out of Stock
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <AddToCartButton productId={product.id} quantity={1} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator className="mt-12 bg-muted/30" />
      </div>
    </section>
  );
}

export default ProductDetails;
