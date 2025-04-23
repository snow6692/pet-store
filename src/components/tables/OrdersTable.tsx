// "use client";
// import { ordersType } from "@/lib/types/order.types";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateOrderStatus } from "@/actions/order.action";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { OrderStatus } from "@prisma/client";
// import { toast } from "react-hot-toast";
// import { Badge } from "../ui/badge";
// import { getPaymentVariant } from "@/lib/variants";
// import OrderProductsDialog from "../dialogs/OrderProductsDialog";
// import OrderUserDialog from "../dialogs/OrderUserDialog";

// function OrdersTable({ orders }: { orders: ordersType }) {
//   const queryClient = useQueryClient();

//   const orderStatus = [
//     { name: "Pending", value: "PENDING" },
//     { name: "On Way", value: "ON_WAY" },
//     { name: "Delivered", value: "DELIVERED" },
//     { name: "Cancelled", value: "CANCELED" },
//   ];

//   const mutation = useMutation({
//     mutationFn: async ({
//       orderId,
//       newStatus,
//     }: {
//       orderId: string;
//       newStatus: OrderStatus;
//     }) => {
//       return await updateOrderStatus(orderId, newStatus);
//     },
//     onMutate: async ({ orderId, newStatus }) => {
//       await queryClient.cancelQueries({ queryKey: ["orders"] }); //

//       const previousOrders = queryClient.getQueryData<ordersType>(["orders"]);

//       queryClient.setQueryData(
//         ["orders"],
//         (oldOrders: ordersType | undefined) =>
//           oldOrders
//             ? oldOrders.map((order) =>
//                 order.id === orderId ? { ...order, status: newStatus } : order
//               )
//             : []
//       );

//       return { previousOrders };
//     },
//     onSuccess: () => {
//       toast.success("Order status updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//     },
//     onError: (error, _, context) => {
//       toast.error("Failed to update order status.");
//       console.error("Mutation error:", error);

//       if (context?.previousOrders) {
//         queryClient.setQueryData(["orders"], context.previousOrders);
//       }
//     },
//   });

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Date</TableHead>
//             <TableHead>Total</TableHead>
//             <TableHead>Products</TableHead>
//             <TableHead>User</TableHead>
//             <TableHead>Payment</TableHead>
//             <TableHead>Status</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {orders?.map((order) => (
//             <TableRow key={order.id}>
//               <TableCell>
//                 {new Date(order.createdAt).toLocaleDateString()}
//               </TableCell>
//               <TableCell>
//                 $
//                 {order.items.reduce(
//                   (acc, item) => acc + item.product.price * item.quantity,
//                   0
//                 )}
//               </TableCell>

//               <TableCell>
//                 <OrderProductsDialog items={order.items}>
//                   <Badge className=" cursor-pointer">Show Products</Badge>
//                 </OrderProductsDialog>
//               </TableCell>

//               <TableCell>
//                 <OrderUserDialog order={order} />
//               </TableCell>
//               <TableCell>
//                 <span className={getPaymentVariant(order.paymentMethod!)}>
//                   {order.paymentMethod === "CASH_ON_DELIVERY"
//                     ? "On Delivery"
//                     : "Visa"}
//                 </span>
//               </TableCell>

//               <TableCell>
//                 <Select
//                   defaultValue={order.status}
//                   onValueChange={(value) =>
//                     mutation.mutate({
//                       orderId: order.id,
//                       newStatus: value as OrderStatus,
//                     })
//                   }
//                 >
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {orderStatus.map((status) => (
//                       <SelectItem key={status.value} value={status.value}>
//                         {status.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// export default OrdersTable;

"use client";

import { ordersType } from "@/lib/types/order.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/actions/order.action";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";
import { toast } from "react-hot-toast";
import OrderProductsDialog from "../dialogs/OrderProductsDialog";
import OrderUserDialog from "../dialogs/OrderUserDialog";
import { Badge } from "../ui/badge";
import { getPaymentVariant } from "@/lib/variants";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.01,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const cellVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const badgeVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

function OrdersTable({ orders }: { orders: ordersType }) {
  const queryClient = useQueryClient();

  const orderStatus = [
    { name: "Pending", value: "PENDING" },
    { name: "On Way", value: "ON_WAY" },
    { name: "Delivered", value: "DELIVERED" },
    { name: "Cancelled", value: "CANCELED" },
  ];

  const mutation = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: string;
      newStatus: OrderStatus;
    }) => {
      return await updateOrderStatus(orderId, newStatus);
    },
    onMutate: async ({ orderId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const previousOrders = queryClient.getQueryData<ordersType>(["orders"]);

      queryClient.setQueryData(
        ["orders"],
        (oldOrders: ordersType | undefined) =>
          oldOrders
            ? oldOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
              )
            : []
      );

      return { previousOrders };
    },
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error, _, context) => {
      toast.error("Failed to update order status.");
      console.error("Mutation error:", error);

      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
    },
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        h-screen
        bg-gradient-to-b from-background via-background to-primary/10
        flex flex-col
        py-8
      "
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-extrabold text-foreground mb-8 text-center tracking-tight bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            Orders Management
          </h1>
        </motion.div>

        <div
          className="
            bg-background/70 backdrop-blur-2xl
            border border-primary/30
            rounded-3xl
            shadow-[0_8px_24px_rgba(0,0,0,0.2)]
            overflow-x-auto
            relative
            before:content-[''] before:absolute before:inset-0
            before:border-4 before:border-transparent
            before:rounded-3xl
            before:transition-all before:duration-500
            hover:before:border-[linear-gradient(45deg,#3b82f6,#a855f7)]
            flex-1
            max-h-[calc(100%-140px)]
            overflow-y-auto
          "
        >
          <Table aria-label="Orders table">
            <TableHeader>
              <TableRow
                className="
                  bg-background/90 backdrop-blur-lg
                  border-b border-primary/30
                  hover:bg-background/95
                  transition-colors duration-300
                  sticky top-0 z-10
                  shadow-sm
                "
              >
                {["Date", "Total", "Products", "User", "Payment", "Status"].map(
                  (header) => (
                    <TableHead
                      key={header}
                      className="
                        text-foreground font-bold text-base py-5
                        relative
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0
                        after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-purple-500
                        after:scale-x-0 after:origin-left after:transition-transform after:duration-300
                        hover:after:scale-x-100
                      "
                    >
                      {header}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {orders?.length ? (
                  orders.map((order) => (
                    <motion.tr
                      key={order.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      exit={{
                        opacity: 0,
                        x: 30,
                        transition: { duration: 0.3 },
                      }}
                      className="
                        border-b border-primary/20
                        group
                        transition-all duration-300
                        relative
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0
                        after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-purple-500
                        after:scale-x-0 after:transition-transform after:duration-500
                        hover:after:scale-x-100
                      "
                    >
                      <TableCell className="text-foreground font-medium text-sm py-5">
                        <motion.div variants={cellVariants}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </motion.div>
                      </TableCell>
                      <TableCell className="text-foreground font-medium text-sm py-5">
                        <motion.div variants={cellVariants}>
                          $
                          {order.items
                            .reduce(
                              (acc, item) =>
                                acc + item.product.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </motion.div>
                      </TableCell>
                      <TableCell className="py-5">
                        <OrderProductsDialog items={order.items}>
                          <motion.div
                            variants={badgeVariants}
                            whileHover="hover"
                            className="inline-block"
                          >
                            <Badge
                              className="
                                bg-primary/20 text-primary hover:bg-primary/30
                                cursor-pointer px-3 py-1 rounded-full
                                transition-all duration-300
                              "
                            >
                              Show Products
                            </Badge>
                          </motion.div>
                        </OrderProductsDialog>
                      </TableCell>
                      <TableCell className="py-5">
                        <OrderUserDialog order={order} key={order.id} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm py-5">
                        <motion.div variants={cellVariants}>
                          <span
                            className={getPaymentVariant(order.paymentMethod!)}
                          >
                            {order.paymentMethod === "CASH_ON_DELIVERY"
                              ? "On Delivery"
                              : "Visa"}
                          </span>
                        </motion.div>
                      </TableCell>
                      <TableCell className="py-5">
                        <motion.div variants={cellVariants}>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) =>
                              mutation.mutate({
                                orderId: order.id,
                                newStatus: value as OrderStatus,
                              })
                            }
                          >
                            <SelectTrigger
                              className="
                                w-[150px] bg-background/80 border-primary/20
                                focus:border-primary focus:ring-2 focus:ring-primary/20
                                transition-all duration-300 rounded-lg
                              "
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatus.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="
                        text-center text-muted-foreground text-base py-12
                        bg-background/80 rounded-b-3xl
                      "
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.9 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 0.6, ease: "easeOut" },
                          },
                          pulse: {
                            scale: [1, 1.02, 1],
                            opacity: [1, 0.9, 1],
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          },
                        }}
                        initial="hidden"
                        animate={["visible", "pulse"]}
                      >
                        <p className="text-lg font-semibold text-foreground">
                          No orders available
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          There are currently no orders to display.
                        </p>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}

export default OrdersTable;
