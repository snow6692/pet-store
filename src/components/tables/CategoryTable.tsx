"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { format } from "date-fns";
import { PenIcon, XIcon } from "lucide-react";
import { category } from "@prisma/client";
import { deleteCategory } from "@/actions/category.action";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";
import toast from "react-hot-toast";
import UpdateCategoryDialog from "../dialogs/UpdateCategoryDialog";
function CategoryTable({ categories }: { categories: category[] }) {
  const handleDelete = async (id: string, name: string) => {
    const promiseDelete = () => deleteCategory(id);

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
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <Image
                  src={category.image}
                  alt={`${category.name} image`}
                  width={36}
                  height={36}
                />
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                {format(new Date(category.createdAt), "dd-MM-yyyy")}
              </TableCell>
              <TableCell>
                <UpdateCategoryDialog category={category}>
                  <PenIcon className=" cursor-pointer text-green-500" />
                </UpdateCategoryDialog>
              </TableCell>
              <TableCell>
                <ConfirmDeleteDialog
                  name={category.name}
                  id={category.id}
                  onDelete={() => handleDelete(category.id, category.name)}
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

export default CategoryTable;
