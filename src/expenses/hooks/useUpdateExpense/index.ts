import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateExpense } from "@/expenses/services/expenseService";

export function useUpdateExpense(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      expenseId,
      body,
    }: {
      expenseId: string;
      body: Parameters<typeof updateExpense>[1];
    }) => updateExpense(expenseId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["expenses", tripId] });
    },
  });
}
