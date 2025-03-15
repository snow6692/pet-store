import { getPaginationProduct } from "@/actions/product.action";
import { cache } from "./cache";
import { MONTH } from "../constants";

export const getCachedProducts = cache(
  (page = 1, limit = 10) => getPaginationProduct({ limit, page }),
  ["products"],
  {
    tags: ["products"],
    revalidate: MONTH,
  }
);
