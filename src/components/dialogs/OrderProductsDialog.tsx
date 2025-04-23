

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CardTitle } from "../ui/card";
import Image from "next/image";
import { orderItemWithProduct } from "@/lib/types/order.types";
import { motion } from "framer-motion";

// Animation variants
const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 },
  },
};

export default function OrderProductsDialog({
  children,
  items,
}: {
  children: ReactNode;
  items: orderItemWithProduct[];
}) {
  return (
    <Dialog>
      <DialogTrigger className="text-blue-500 hover:underline">
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-background/70 backdrop-blur-2xl border border-primary/30 rounded-2xl">
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Order Products
            </DialogTitle>
          </DialogHeader>
          <motion.div variants={itemVariants} className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex gap-4 p-4 bg-background/80 border border-primary/20 rounded-lg"
              >
                <Image
                  src={item.product.images[0] || "/placeholder.png"}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <CardTitle className="text-lg text-foreground">
                    {item.product.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
