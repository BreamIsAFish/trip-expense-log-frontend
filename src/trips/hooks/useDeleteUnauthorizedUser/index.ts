import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUnauthorizedUser } from "@/trips/services/unauthorizedUserService";

export function useDeleteUnauthorizedUser(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (unauthorizedUserId: string) =>
      deleteUnauthorizedUser(unauthorizedUserId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["unauthorizedUsers", tripId] });
    },
  });
}
