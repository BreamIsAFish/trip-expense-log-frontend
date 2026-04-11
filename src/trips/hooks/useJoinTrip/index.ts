import { useMutation, useQueryClient } from "@tanstack/react-query";

import { joinTrip } from "@/trips/services/tripService";

export function useJoinTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      tripId,
      inviteCode,
    }: {
      tripId: string;
      inviteCode: string;
    }) => joinTrip(tripId, inviteCode),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
