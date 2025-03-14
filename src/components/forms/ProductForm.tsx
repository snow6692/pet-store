"use client";
import { productZod } from "@/validations/product.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import { useForm } from "react-hook-form";

interface IProps {
  product?: Product;
}
function ProductForm({ product }: IProps) {
  const form = useForm({
    resolver: zodResolver(productZod),
    defaultValues: product
      ? {
          name: product.name || "",
          slug: product.slug || "",
          images: product.images || [],
          price: product.price || 1,
          description: product.description ?? null,
          quantity: product.quantity ?? 1,
          status: product.status || "ACTIVE",
          discount: product.discount ?? null,
          brand: product.brand ?? null,
          isFeatured: product.isFeatured ?? false,
        }
      : {
          name: "",
          slug: "",
          images: [],
          price: 1,
          description: null,
          quantity: 1,
          status: "ACTIVE",
          discount: null,
          brand: null,
          isFeatured: false,
        },
  });
 

  return <div>ProductForm</div>;
}

export default ProductForm;
