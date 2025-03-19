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
import { Badge } from "../ui/badge";
import { getPaymentVariant } from "@/lib/variants";
import OrderUserDialog from "../dialogs/OrderUserDialog";

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
      await queryClient.cancelQueries({ queryKey: ["orders"] }); //

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                $
                {order.items.reduce(
                  (acc, item) => acc + item.product.price * item.quantity,
                  0
                )}
              </TableCell>

              <TableCell>
                <OrderProductsDialog items={order.items}>
                  <Badge className=" cursor-pointer">Show Products</Badge>
                </OrderProductsDialog>
              </TableCell>

              <TableCell>
                <OrderUserDialog order={order} />
              </TableCell>
              <TableCell>
                <span className={getPaymentVariant(order.paymentMethod!)}>
                  {order.paymentMethod === "CASH_ON_DELIVERY"
                    ? "On Delivery"
                    : "Visa"}
                </span>
              </TableCell>

              <TableCell>
                <Select
                  defaultValue={order.status}
                  onValueChange={(value) =>
                    mutation.mutate({
                      orderId: order.id,
                      newStatus: value as OrderStatus,
                    })
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatus.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default OrdersTable;
