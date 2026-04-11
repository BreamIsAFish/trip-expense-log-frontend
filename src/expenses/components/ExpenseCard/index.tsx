import type { FC } from "react";

import { formatCurrency, formatDate } from "@/shared/utils/formatters";

import type { ExpenseCardProps } from "./types";
import { ExpenseCardRoot } from "./styles";
import { Button } from "@/ui/components/Button";

export const ExpenseCard: FC<ExpenseCardProps> = ({
  expense,
  members,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const participantNames = expense.participant_ids
    .map((id) => members.find((m) => m.user_id === id)?.display_name ?? id)
    .join(", ");

  const canModify =
    expense.payer_id === currentUserId ||
    members.some((m) => m.user_id === currentUserId);

  return (
    <ExpenseCardRoot>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{expense.name}</h3>
          {expense.description ? (
            <p className="mt-1 text-sm text-slate-400">{expense.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-slate-300">
            <span className="text-cyan-300">
              {formatCurrency(expense.amount)}
            </span>
            {" · "}
            Paid by <strong>{expense.payer_name}</strong>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Split: {participantNames || "—"}
          </p>
          <p className="mt-2 text-xs text-slate-600">
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
