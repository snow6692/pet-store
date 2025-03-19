import { getMyOrders } from "@/actions/order.action";
export type GetMyOrdersReturnType = Awaited<ReturnType<typeof getMyOrders>>;

export type ordersType = GetMyOrdersReturnType["myOrders"];
export type orderType = ordersType[];
