import { useQuery } from "@tanstack/react-query";
import { getYourRating } from "@/actions/rating.action";

export function useYourRating(productId: string) {
  return useQuery({
    queryKey: ["your-rating", productId],
    queryFn: () => getYourRating({ productId }),
  });
}
