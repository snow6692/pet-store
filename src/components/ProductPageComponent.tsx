import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import Image from "next/image";
import React from "react";
import AddToCartButton from "./buttons/AddToCartButton";

interface IProps {
  product: ProductWithCategoriesTable;
}
function ProductPageComponent({ product }: IProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <Image
            src={product.images?.[0]}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>

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
        </div>
        <AddToCartButton productId={product.id} quantity={1} />
      </div>
    </div>
  );
}

export default ProductPageComponent;
