"use client";
import { CategoryStatus } from "@prisma/client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { format } from "date-fns";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { deleteProduct } from "@/actions/product.action";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  description: string | null;
  quantity: number;
  status: string;
  discount: number | null;
  rating: number;
  brand: string | null;
  isFeatured: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    image: string;
    status: CategoryStatus;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface ProductsTableProps {
  products: Product[];
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
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {/* <Image
                  src={product.image}
                  alt={`${product.name} image`}
                  width={36}
                  height={36}
                /> */}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {format(new Date(product.createdAt), "dd-MM-yyyy")}
              </TableCell>
              <TableCell>
                {/* Update dialog */}
                {/* <UpdateDialog category={product}>
                  <PenIcon className=" cursor-pointer text-green-500" />
                </UpdateDialog> */}
              </TableCell>
              <TableCell>
                <ConfirmDeleteDialog
                  name={product.name}
                  id={product.id}
                  onDelete={() => handleDelete(product.id, product.name)}
                >
                  <XIcon className=" cursor-pointer text-red-500" />
                </ConfirmDeleteDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductsTableComponent;
