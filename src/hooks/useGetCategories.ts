import { getAllCategoriesWithoutPagination } from "@/actions/category.action";
import { useQuery } from "@tanstack/react-query";

export function useGetAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesWithoutPagination,
  });
}
