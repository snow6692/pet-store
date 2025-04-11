import { cachedUser } from "@/lib/cache/user.cache";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: cachedUser,
    staleTime: 1000 * 60 * 5,
  });
};
