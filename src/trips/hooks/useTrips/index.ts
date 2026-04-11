import { useQuery } from "@tanstack/react-query";

import { listTrips } from "@/trips/services/tripService";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: listTrips,
  });
}
