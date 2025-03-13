import { getAllCategories } from "@/actions/category.action";
import { cache } from "./cache";
import { MONTH } from "../constants";

export const getCachedCategories = cache(
  () => getAllCategories(),
  ["categories"],
  {
    tags: ["categories"],
    revalidate: MONTH,
  }
);
