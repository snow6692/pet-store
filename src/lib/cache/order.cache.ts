import { cache } from "./cache";
import { MONTH } from "../constants";
import { getMyOrders } from "@/actions/order.action";

export const getMyCachedOrders = cache(
  (page = 1, limit = 10) => getMyOrders({ limit, page }),
  ["orders", "my-orders"],
  {
    tags: ["products"],
    revalidate: MONTH,
  }
);
