import type { FC } from "react";
import { useEffect, useState } from "react";

import { ExpenseForm } from "@/expenses/components/ExpenseForm";
import { useBulkCreateExpenses } from "@/expenses/hooks/useBulkCreateExpenses";
import type { CreateUpdateExpenseBody } from "@/expenses/services/expenseService";
import {
  createEmptyDraft,
  revalidateDraft,
} from "@/expenses/utils/csvParser";
import { formatCurrency } from "@/shared/utils/formatters";
import { Button } from "@/ui/components/Button";
import { Modal } from "@/ui/components/Modal";

import { draftToExpenseResponse } from "./draftToExpenseResponse";
import type { BulkImportModalProps, DraftExpense } from "./types";

function payerLabel(
  draft: DraftExpense,
  members: BulkImportModalProps["members"],
  unauthorizedUsers: BulkImportModalProps["unauthorizedUsers"],
): string {
  if (draft.payer_type === "user" && draft.payer_id) {
    return (
      members.find((m) => m.user_id === draft.payer_id)?.display_name ??
      "Unknown member"
    );
  }
  if (
    draft.payer_type === "unauthorized_user" &&
    draft.payer_unauthorized_user_id
  ) {
    return (
      unauthorizedUsers.find((u) => u.id === draft.payer_unauthorized_user_id)
        ?.display_name ?? "Unknown guest"
    );
  }
  return "—";
}

export const BulkImportModal: FC<BulkImportModalProps> = ({
  open,
  onClose,
  tripId,
  members,
  unauthorizedUsers,
  initialDrafts,
}) => {
  const bulk = useBulkCreateExpenses(tripId);
  const [rows, setRows] = useState<DraftExpense[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }
    setRows(initialDrafts);
    setEditingId(null);
    setCompletedCount(0);
  }, [open, initialDrafts]);

  const handleClose = () => {
    if (bulk.isPending) {
      return;
    }
    onClose();
  };

  const updateRow = (id: string, patch: Partial<DraftExpense>) => {
    setRows((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...patch } : r)),
    );
  };

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r._id !== id));
    setEditingId((e) => (e === id ? null : e));
  };

  const handleSaveEdit = (id: string, body: CreateUpdateExpenseBody) => {
    const errs = revalidateDraft(body);
    updateRow(id, {
      ...body,
      _errors: errs?.length ? errs : undefined,
    });
    setEditingId(null);
  };

  const onAddRow = () => {
    const draft = createEmptyDraft(members, unauthorizedUsers);
    setRows((prev) => [...prev, draft]);
    setEditingId(draft._id);
  };

  const hasBlockingErrors = rows.some((r) => (r._errors?.length ?? 0) > 0);
  const canSubmit =
    rows.length > 0 && !hasBlockingErrors && !bulk.isPending;

  const onConfirmAll = () => {
    if (!canSubmit) {
      return;
    }
    setCompletedCount(0);
    bulk.mutate(
      {
        drafts: rows,
        onProgress: (done) => setCompletedCount(done),
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  };

  return (
    <Modal
      open={open}
      title="Review imported expenses"
      onClose={handleClose}
      dialogClassName="max-w-3xl"
      footer={
        <>
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={bulk.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onAddRow}
            disabled={bulk.isPending}
          >
            Add expense
          </Button>
          <Button
            type="button"
            onClick={onConfirmAll}
            disabled={!canSubmit}
          >
            {bulk.isPending
              ? `Adding… (${completedCount}/${rows.length})`
              : `Add ${rows.length} expense${rows.length === 1 ? "" : "s"}`}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-stone-500">
          Fix any highlighted rows, edit details, remove lines, or add new
          expenses before confirming.
        </p>

        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-violet-200 bg-violet-50/40 px-4 py-6 text-center text-sm text-stone-600">
            No rows to import. Close this dialog and choose a CSV file, or click
            &quot;Add expense&quot; to create entries manually.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((draft, index) => {
              const editing = editingId === draft._id;
              const errs = draft._errors ?? [];
              const invalid = errs.length > 0;
              const doneDuringSubmit =
                bulk.isPending && index < completedCount;

              return (
                <li
                  key={draft._id}
                  className={`rounded-lg border p-4 ${
                    invalid
                      ? "border-rose-300 bg-rose-50/40"
                      : "border-violet-200/80 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    {!editing ? (
                      <>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-stone-800">
                              {draft.name.trim()
                                ? draft.name
                                : "(untitled)"}
                            </span>
                            {doneDuringSubmit ? (
                              <span
                                className="text-emerald-600"
                                aria-hidden
                                title="Saved"
                              >
                                ✓
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-stone-600">
                            {formatCurrency(draft.amount)} · Paid by{" "}
                            {payerLabel(draft, members, unauthorizedUsers)} ·{" "}
                            {draft.participants.length} participant
                            {draft.participants.length === 1 ? "" : "s"}
                          </p>
                          {draft.description.trim() ? (
                            <p className="text-xs text-stone-500">
                              {draft.description}
                            </p>
                          ) : null}
                          {invalid ? (
                            <ul className="mt-2 list-inside list-disc text-sm text-rose-700">
                              {errs.map((e, i) => (
                                <li key={`${i}-${e}`}>{e}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            variant="secondary"
                            type="button"
                            disabled={bulk.isPending}
                            onClick={() => setEditingId(draft._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            type="button"
                            disabled={bulk.isPending}
                            onClick={() => deleteRow(draft._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full space-y-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel edit
                          </Button>
                        </div>
                        <ExpenseForm
                          key={draft._id}
                          members={members}
                          unauthorizedUsers={unauthorizedUsers}
                          initial={draftToExpenseResponse(
                            draft,
                            tripId,
                            members,
                            unauthorizedUsers,
                          )}
                          submitLabel="Save row"
                          pending={false}
                          onSubmit={(body) => handleSaveEdit(draft._id, body)}
                        />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {bulk.error ? (
          <p className="text-sm text-rose-600">
            {bulk.error instanceof Error
              ? bulk.error.message
              : "Failed to save expenses"}
          </p>
        ) : null}
      </div>
    </Modal>
  );
};
