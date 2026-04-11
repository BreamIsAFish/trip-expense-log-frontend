import { useQuery } from "@tanstack/react-query";

import { getTrip } from "@/trips/services/tripService";

export function useTripDetail(tripId: string | undefined) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTrip(tripId as string),
    enabled: Boolean(tripId),
  });
}
