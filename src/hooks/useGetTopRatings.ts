import { getTopRatings } from "@/actions/rating.action";
import { useQuery } from "@tanstack/react-query";

export function useGetTopRatings() {
  return useQuery({
    queryKey: ["top-ratings"],
    queryFn: getTopRatings,
  });
}
