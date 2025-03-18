import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import WishlistIcon from "./WishlistIcon";

interface IProps {
  product: ProductWithCategoriesTable;
}
function ProductCard({ product }: IProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="relative">
        <Image
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
          width={300}
          height={200}
        />
        <WishlistIcon productId={product.id} />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm">Price: ${product.price}</p>

        <p className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          {product.category.name}
        </p>

        <Link href={`/products/product/${product.slug}`}>
          <Button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            More details
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
