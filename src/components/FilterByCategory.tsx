"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetAllCategories } from "@/hooks/useGetCategories";
import { useRouter, useSearchParams } from "next/navigation";

function FilterByCategory() {
  const { data: categories } = useGetAllCategories();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryName = searchParams.get("category") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/products/filter?${params.toString()}`);
  };
  return (
    <Select value={categoryName} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories?.map((cat) => (
          <SelectItem key={cat.id} value={cat.name}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FilterByCategory;
