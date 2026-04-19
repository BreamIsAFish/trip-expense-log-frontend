import type { FC } from "react";

import { useCreateExpense } from "@/expenses/hooks/useCreateExpense";
import { useUpdateExpense } from "@/expenses/hooks/useUpdateExpense";
import { ExpenseForm } from "@/expenses/components/ExpenseForm";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";

import type { AddExpenseModalProps } from "./types";

export const AddExpenseModal: FC<AddExpenseModalProps> = ({
  open,
  onClose,
  tripId,
  members,
  unauthorizedUsers,
  expense,
  mode,
}) => {
  const create = useCreateExpense(tripId);
  const update = useUpdateExpense(tripId);

  const title = mode === "create" ? "Add expense" : "Edit expense";
  const pending = create.isPending || update.isPending;
  const mutationError = create.error ?? update.error;

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <ExpenseForm
        key={mode === "edit" ? (expense?.id ?? "edit") : "create"}
        members={members}
        unauthorizedUsers={unauthorizedUsers}
        initial={mode === "edit" ? expense ?? null : null}
        submitLabel={mode === "create" ? "Add expense" : "Save changes"}
        pending={pending}
        onSubmit={(values) => {
          if (mode === "create") {
            create.mutate(values, { onSuccess: onClose });
          } else if (expense) {
            update.mutate(
              { expenseId: expense.id, body: values },
              { onSuccess: onClose },
            );
          }
        }}
      />
      {mutationError ? (
        <p className="mt-3 text-sm text-rose-600">
          {mutationError instanceof Error
            ? mutationError.message
            : "Request failed"}
        </p>
      ) : null}
    </Modal>
  );
};
