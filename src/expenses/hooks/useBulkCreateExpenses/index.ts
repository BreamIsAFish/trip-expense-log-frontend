import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createExpense,
  type CreateUpdateExpenseBody,
} from "@/expenses/services/expenseService";
import type { DraftExpense } from "@/expenses/components/BulkImportModal/types";

function draftToCreateBody(d: DraftExpense): CreateUpdateExpenseBody {
  const { _id, _errors, ...body } = d;
  void _id;
  void _errors;
  return body;
}

export function useBulkCreateExpenses(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      drafts,
      onProgress,
    }: {
      drafts: DraftExpense[];
      onProgress?: (completedCount: number, total: number) => void;
    }) => {
      const total = drafts.length;
      for (let i = 0; i < drafts.length; i++) {
        await createExpense(tripId, draftToCreateBody(drafts[i]));
        onProgress?.(i + 1, total);
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["expenses", tripId] });
    },
  });
}
