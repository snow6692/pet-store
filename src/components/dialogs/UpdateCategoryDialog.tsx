import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReactNode } from "react";
import CategoryForm from "../forms/CategoryForm";
import { category } from "@prisma/client";
function UpdateCategoryDialog({
  children,
  category,
}: {
  children: ReactNode;
  category: category;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to your Category here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCategoryDialog;
