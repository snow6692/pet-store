import { getTopRatings } from "@/actions/rating.action";
import { useQuery } from "@tanstack/react-query";

export function useGetTopRatings() {
  return useQuery({
    queryKey: ["top-ratings"],
    queryFn: getTopRatings,
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    staleTime: 20 * 60 * 1000, // Data is fresh for 20 minutes
    retry: 2, // Retry failed requests twice
  });
}
