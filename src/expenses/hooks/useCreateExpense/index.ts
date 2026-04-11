import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExpense } from "@/expenses/services/expenseService";

export function useCreateExpense(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof createExpense>[1]) =>
      createExpense(tripId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["expenses", tripId] });
    },
  });
}
