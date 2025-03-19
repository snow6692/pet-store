"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format } from "date-fns";
import ConfirmDeleteDialog from "../dialogs/ConfirmDeleteDialog";
import { PenIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { deleteProduct } from "@/actions/product.action";
import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import UpdateProductDialog from "../dialogs/UpdateProductDialog";

interface ProductsTableProps {
  products: ProductWithCategoriesTable[];
}

function ProductsTableComponent({ products }: ProductsTableProps) {
  const handleDelete = async (id: string, name: string) => {
    const promiseDelete = () => deleteProduct(id);

    toast.promise(promiseDelete(), {
      loading: `${name} is being deleted...`,
      success: `${name} deleted successfully!`,
      error: `Failed to delete ${name}`,
    });
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.length ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {format(new Date(product.createdAt), "PP")}
                </TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <UpdateProductDialog product={product}>
                    <PenIcon className="cursor-pointer text-green-500" />
                  </UpdateProductDialog>
                </TableCell>
                <TableCell>
                  <ConfirmDeleteDialog
                    name={product.name}
                    id={product.id}
                    onDelete={() => handleDelete(product.id, product.name)}
                  >
                    <XIcon className="cursor-pointer text-red-500" />
                  </ConfirmDeleteDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No products available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductsTableComponent;
