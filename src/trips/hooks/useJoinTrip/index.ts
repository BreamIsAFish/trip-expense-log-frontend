import { useMutation, useQueryClient } from "@tanstack/react-query";

import { joinTripByInviteCode } from "@/trips/services/tripService";

export function useJoinTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ inviteCode }: { inviteCode: string }) =>
      joinTripByInviteCode(inviteCode),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
