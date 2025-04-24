// import { getUser } from "@/actions/user.action";
// import { useQuery } from "@tanstack/react-query";

// export const useCurrentUser = () => {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: getUser,
//     staleTime: 1000 * 60 * 5,
//   });
// };

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // No server call; use initialUser and session
      return session?.user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!session, // Only run when session is available
  });
}
