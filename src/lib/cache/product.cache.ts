import { getPaginationProduct } from "@/actions/product.action";
import { cache } from "./cache";
import { MONTH } from "../constants";

export const getCachedProducts = cache(
  () => getPaginationProduct({ limit: 10, page: 1 }),
  ["products"],
  { revalidate: MONTH, tags: ["products"] }
);
