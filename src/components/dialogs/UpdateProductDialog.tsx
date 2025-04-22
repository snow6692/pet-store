"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import ProductForm from "../forms/ProductForm";
import { motion } from "framer-motion";

interface UpdateProductDialogProps {
  children: React.ReactNode;
  product: ProductWithCategoriesTable;
}

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

function UpdateProductDialog({ children, product }: UpdateProductDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <motion.div
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <DialogContent
          className="
            max-w-3xl min-w-3/4
            max-h-[calc(100vh-2rem)] overflow-y-auto
            bg-background/60 backdrop-blur-xl
            border border-primary/20
            rounded-2xl
            shadow-[0_4px_12px_rgba(0,0,0,0.1)]
          
            before:content-[''] before:absolute before:inset-0
            before:border-2 before:border-transparent
            before:rounded-2xl
            before:transition-all before:duration-500
            hover:before:border-[linear-gradient(45deg,#3b82f6,#a855f7)]
            p-4
            overscroll-contain
          "
          aria-describedby="dialog-description"
        >
          <DialogHeader className="sticky top-0 bg-background/60 backdrop-blur-xl z-10 pb-2">
            <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
              Edit Product
            </DialogTitle>
            <DialogDescription
              id="dialog-description"
              className="text-sm text-muted-foreground"
            >
              Make changes to your product here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <ProductForm product={product} isInDialog={true} />
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}

export default UpdateProductDialog;
