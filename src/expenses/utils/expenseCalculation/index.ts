import type { ExpenseResponse } from "@/expenses/types";

export function sumExpenseAmounts(expenses: ExpenseResponse[]): number {
  return expenses.reduce((acc, e) => {
    const n = Number.parseFloat(e.amount);
    return acc + (Number.isNaN(n) ? 0 : n);
  }, 0);
}

export function sharePerParticipant(expense: ExpenseResponse): number {
  const n = Number.parseFloat(expense.amount);
  const count = expense.participant_ids.length || 1;
  if (Number.isNaN(n)) {
    return 0;
  }
  return n / count;
}
