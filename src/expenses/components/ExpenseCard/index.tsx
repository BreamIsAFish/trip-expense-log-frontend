import type { FC } from "react";

import { formatCurrency, formatDate } from "@/shared/utils/formatters";

import type { ExpenseCardProps } from "./types";
import { ExpenseCardRoot } from "./styles";
import { Button } from "@/ui/components/Button";

function participantLabel(
  p: import("@/expenses/types").ExpenseParticipant,
): string {
  if (p.type === "user") {
    return p.display_name ?? p.user_id ?? "Member";
  }
  return p.name ?? p.unauthorized_user_id ?? "Guest";
}

export const ExpenseCard: FC<ExpenseCardProps> = ({
  expense,
  members,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const participantNames = expense.participants.map(participantLabel).join(", ");

  const userIsPayer =
    expense.payer_type === "user" && expense.payer_id === currentUserId;

  const canModify =
    userIsPayer || members.some((m) => m.user_id === currentUserId);

  return (
    <ExpenseCardRoot>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">{expense.name}</h3>
          {expense.description ? (
            <p className="mt-1 text-sm text-stone-500">{expense.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-stone-600">
            <span className="font-medium text-brand-700">
              {formatCurrency(expense.amount)}
            </span>
            {" · "}
            Paid by <strong>{expense.payer_name}</strong>
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Split: {participantNames || "—"}
          </p>
          <p className="mt-2 text-xs text-stone-400">
            {formatDate(expense.created_at)}
          </p>
        </div>
        {canModify ? (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => onEdit(expense)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={() => onDelete(expense)}
            >
              Delete
            </Button>
          </div>
        ) : null}
      </div>
    </ExpenseCardRoot>
  );
};
