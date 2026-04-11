import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTrip } from "@/trips/services/tripService";

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
