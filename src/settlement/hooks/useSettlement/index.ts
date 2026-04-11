import { useQuery } from "@tanstack/react-query";

import { getSettlement } from "@/settlement/services/settlementService";

export function useSettlement(tripId: string | undefined) {
  return useQuery({
    queryKey: ["settlement", tripId],
    queryFn: () => getSettlement(tripId as string),
    enabled: Boolean(tripId),
  });
}
