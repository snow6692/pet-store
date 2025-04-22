import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import WishlistIcon from "../icons/WishlistIcon";

interface IProps {
  product: ProductWithCategoriesTable;
}

function ProductCard({ product }: IProps) {
  // Treat discount as a percentage (e.g., 20 means 20% off)
  const discountPercentage = product.discount || 0;
  const discountedPrice = discountPercentage
    ? product.price * (1 - Math.min(discountPercentage, 100) / 100)
    : product.price;

  return (
    <Card className="group relative overflow-hidden border-none shadow-md bg-background/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[4/3]">
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={product.isFeatured}
        />
        <div className="absolute top-3 right-3">
          <WishlistIcon productId={product.id} />
        </div>
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
            {Math.round(discountPercentage)}% OFF
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
          {product.name}
        </h3>
        {product.brand && (
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        )}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/50"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating.toFixed(1)})
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-lg font-bold text-foreground">
            ${discountedPrice.toFixed(2)}
          </p>
          {discountPercentage > 0 && (
            <p className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
        <Badge variant="secondary" className="mt-2">
          {product.category.name}
        </Badge>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-4 pt-0">
        <Link href={`/products/product/${product.slug}`} className="w-full">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300">
            More Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
