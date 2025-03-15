import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReactNode } from "react";

import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import ProductForm from "../forms/ProductForm";
function UpdateProductDialog({
  children,
  product,
}: {
  children: ReactNode;
  product: ProductWithCategoriesTable;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-dvw">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your Product here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <ProductForm product={product} />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProductDialog;
