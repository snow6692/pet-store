import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import AddToCartButton from "./buttons/AddToCartButton";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductImageSelector from "./ProductImageSelector";

function ProductDetails({ product }: { product: ProductWithCategoriesTable }) {
  const averageRating = product.rating ?? 0; // Handle null case

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "h-5 w-5",
          index < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <ProductImageSelector images={product.images || []} />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          {/* Rating section */}
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(averageRating)}</div>
            <span className="text-sm text-gray-500">
              ({averageRating.toFixed(1)})
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xl font-semibold text-green-600">
              ${product.price}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Category:</h3>
            <p className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-lg">
              {product.category.name}
            </p>
          </div>

          {/* Add to cart button */}
          <div className="mt-6">
            {product.quantity === 0 ? (
              <Button variant={"outline"} className="w-full">
                Out of stock
              </Button>
            ) : (
              <AddToCartButton productId={product.id} quantity={1} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
