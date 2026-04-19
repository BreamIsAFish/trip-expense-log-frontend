import type { FC } from "react";

import { sumExpenseAmounts } from "@/expenses/utils/expenseCalculation";
import { ExpenseCard } from "@/expenses/components/ExpenseCard";
import { useDeleteExpense } from "@/expenses/hooks/useDeleteExpense";
import { formatCurrency } from "@/shared/utils/formatters";
import { Loading } from "@/ui/components/Loading";

import type { ExpenseListProps } from "./types";
import type { ExpenseResponse } from "@/expenses/types";
import { ExpenseStack } from "./styles";

export const ExpenseList: FC<ExpenseListProps> = ({
  tripId,
  expenses,
  isLoading,
  error,
  members,
  currentUserId,
  onEditExpense,
}) => {
  const deleteExpense = useDeleteExpense(tripId);

  const onDelete = (expense: ExpenseResponse) => {
    if (!window.confirm(`Delete “${expense.name}”?`)) {
      return;
    }
    deleteExpense.mutate(expense.id);
  };

  if (isLoading) {
    return <Loading label="Loading expenses…" />;
  }
  if (error != null) {
    return (
      <p className="text-rose-600">
        {error instanceof Error ? error.message : "Failed to load expenses"}
      </p>
    );
  }

  const total = sumExpenseAmounts(expenses);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold text-stone-800">Expenses</h2>
        <p className="text-sm text-stone-500">
          Total:{" "}
          <span className="font-mono font-medium text-brand-700">
            {formatCurrency(total.toFixed(2))}
          </span>
        </p>
      </div>
      {expenses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-violet-200/90 bg-white/60 p-6 text-center text-stone-500">
          No expenses yet.
        </p>
      ) : (
        <ExpenseStack>
          {expenses.map((e) => (
            <ExpenseCard
              key={e.id}
              expense={e}
              members={members}
              currentUserId={currentUserId}
              onEdit={onEditExpense}
              onDelete={onDelete}
            />
          ))}
        </ExpenseStack>
      )}
    </div>
  );
};
