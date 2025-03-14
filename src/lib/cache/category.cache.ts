import { getAllCategories } from "@/actions/category.action";
import { cache } from "./cache";
import { MONTH } from "../constants";

export const getCachedCategories = cache(
  (page = 1, limit = 10) => getAllCategories({ limit, page }),
  ["categories"],
  {
    tags: ["categories"],
    revalidate: MONTH,
  }
);
