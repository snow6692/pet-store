import { getMyOrders } from "@/actions/order.action";
import { Prisma } from "@prisma/client";
export type GetMyOrdersReturnType = Awaited<ReturnType<typeof getMyOrders>>;

export type ordersType = GetMyOrdersReturnType["myOrders"];
export type orderType = ordersType[];

export type orderItemWithProduct = Prisma.OrderItemGetPayload<{
  include: { product: true };
}>;
