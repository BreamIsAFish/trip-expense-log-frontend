import { useQuery } from "@tanstack/react-query";

import { listUnauthorizedUsers } from "@/trips/services/unauthorizedUserService";

export function useUnauthorizedUsers(tripId: string) {
  return useQuery({
    queryKey: ["unauthorizedUsers", tripId],
    queryFn: () => listUnauthorizedUsers(tripId),
    enabled: Boolean(tripId),
  });
}
