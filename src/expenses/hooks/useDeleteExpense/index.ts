import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExpense } from "@/expenses/services/expenseService";

export function useDeleteExpense(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["expenses", tripId] });
    },
  });
}
