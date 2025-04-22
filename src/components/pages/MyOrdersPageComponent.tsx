"use client";

import Image from "next/image";
import { ordersType } from "@/lib/types/order.types";
import { getPaymentVariant, getStatusVariant } from "@/lib/variants";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const totalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.2 } },
};

export default function MyOrdersPageComponent({
  myOrders,
}: {
  myOrders: ordersType;
}) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast.success("Payment successful! Your order has been placed. 🌟", {
        duration: 5000,
        style: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          color: "#1a1a1a",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        },
      });
    }
  }, [sessionId]);

  if (!myOrders || myOrders.length === 0) {
    return (
      <Card className="max-w-6xl mx-auto border-none shadow-2xl bg-background/95 backdrop-blur-md rounded-xl">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground text-xl font-semibold tracking-tight">
            You have no orders yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="border-none shadow-2xl bg-background/95 backdrop-blur-md rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl pointer-events-none" />
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            My Orders
          </CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base">
            View your recent purchases and order details
          </p>
        </CardHeader>
        <CardContent className="space-y-8 py-6">
          <AnimatePresence>
            {myOrders.map((order) => {
              const totalPrice = order.items.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              );

              return (
                <motion.div
                  key={order.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="group"
                >
                  <Card className="relative border-none shadow-lg bg-background/80 backdrop-blur-md p-6 rounded-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg pointer-events-none group-hover:from-primary/40 group-hover:to-secondary/40 transition-all duration-500" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge
                          className={`${getStatusVariant(
                            order.status
                          )} text-white font-semibold px-4 py-1.5 rounded-full animate-pulse-subtle hover:shadow-glow transition-all duration-300`}
                          aria-label={`Order status: ${order.status.replace(
                            "_",
                            " "
                          )}`}
                        >
                          {order.status.replace("_", " ")}
                        </Badge>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Badge
                          className={`${getPaymentVariant(
                            order.paymentMethod || ""
                          )} text-white font-semibold px-4 py-1.5 rounded-full animate-pulse-subtle hover:shadow-glow transition-all duration-300`}
                          aria-label={`Payment method: ${order.paymentMethod?.replace(
                            "_",
                            " "
                          )}`}
                        >
                          {order.paymentMethod?.replace("_", " ")}
                        </Badge>
                      </motion.div>
                    </div>

                    {/* Order Details */}
                    <div className="flex flex-col sm:flex-row justify-between mb-6 text-sm text-muted-foreground">
                      <p className="mb-2 sm:mb-0">
                        <span className="font-semibold text-foreground">
                          Order ID:
                        </span>{" "}
                        {order.id.slice(0, 8)}...
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">
                          Date:
                        </span>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          className="flex items-center gap-4 border-b border-muted/20 py-3 group/item"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="relative group/image">
                            <Image
                              src={item.product.images[0] || "/placeholder.png"}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover transition-transform duration-300 group-hover/item:ring-2 group-hover/item:ring-primary/50 group-hover/image:scale-105"
                              style={{
                                transformStyle: "preserve-3d",
                              }}
                            />
                            <div className="absolute inset-0 rounded-lg group-hover/image:shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-shadow duration-300" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-base group-hover/item:bg-clip-text group-hover/item:text-transparent group-hover/item:bg-gradient-to-r group-hover/item:from-primary group-hover/item:to-secondary transition-all duration-300">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm font-bold text-foreground">
                              ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total Price */}
                    <motion.p
                      variants={totalVariants}
                      className="mt-6 text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                    >
                      Total: ${totalPrice.toFixed(2)}
                    </motion.p>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
