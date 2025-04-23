

"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@prisma/client";
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

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

interface IProps {
  order: Order;
}

const OrderUserDialog = ({ order }: IProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          variants={{
            rest: { scale: 1 },
            hover: {
              scale: 1.05,
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            },
          }}
          whileHover="hover"
        >
          <Badge className="cursor-pointer px-3 py-1 text-sm bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-all duration-300">
            Show Order Details
          </Badge>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-background/70 backdrop-blur-2xl border border-primary/30 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              User Details
            </DialogTitle>
          </DialogHeader>
          <motion.div variants={contentVariants} className="space-y-3">
            <Card className="bg-background/80 border border-primary/20">
              <CardContent className="space-y-3 p-4">
                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Name</p>
                  <p className="text-sm text-muted-foreground">{order.name}</p>
                </motion.div>
                <Separator className="bg-primary/20" />
                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                </motion.div>
                <Separator className="bg-primary/20" />
                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                </motion.div>
                <Separator className="bg-primary/20" />
                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.address}
                  </p>
                </motion.div>
                <Separator className="bg-primary/20" />
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">City</p>
                    <p className="text-sm text-muted-foreground">
                      {order.city}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">State</p>
                    <p className="text-sm text-muted-foreground">
                      {order.state}
                    </p>
                  </div>
                </motion.div>
                <Separator className="bg-primary/20" />
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Country
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.country}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Postal Code
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.postalCode}
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderUserDialog;
