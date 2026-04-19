import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addUnauthorizedUser } from "@/trips/services/unauthorizedUserService";

export function useAddUnauthorizedUser(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (displayName: string) =>
      addUnauthorizedUser(tripId, displayName),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["unauthorizedUsers", tripId] });
    },
  });
}
