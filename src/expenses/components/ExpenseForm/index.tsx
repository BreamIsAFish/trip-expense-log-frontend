import type { FC, FormEvent } from "react";
import { useEffect, useState } from "react";

import { validateExpenseForm } from "./validation";
import type { ExpenseFormProps } from "./types";
import { Input } from "@/ui/components/Input";
import { Button } from "@/ui/components/Button";

import { keysToCreateBody } from "@/expenses/utils/expensePayload";

function keysFromExpense(
  expense: NonNullable<ExpenseFormProps["initial"]>,
): string[] {
  if (!expense?.participants?.length) {
    return [];
  }
  return expense.participants.map((p) =>
    p.type === "user" && p.user_id
      ? `u:${p.user_id}`
      : `au:${p.unauthorized_user_id ?? ""}`,
  );
}

function payerKeyFromExpense(
  expense: NonNullable<ExpenseFormProps["initial"]>,
): string {
  if (expense.payer_type === "user" && expense.payer_id) {
    return `u:${expense.payer_id}`;
  }
  if (
    expense.payer_type === "unauthorized_user" &&
    expense.payer_unauthorized_user_id
  ) {
    return `au:${expense.payer_unauthorized_user_id}`;
  }
  return "";
}

export const ExpenseForm: FC<ExpenseFormProps> = ({
  members,
  unauthorizedUsers,
  initial,
  submitLabel,
  pending,
  onSubmit,
}) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [payerKey, setPayerKey] = useState(() => {
    if (initial) {
      return payerKeyFromExpense(initial);
    }
    return members[0] ? `u:${members[0].user_id}` : "";
  });
  const [participantKeys, setParticipantKeys] = useState<string[]>(() => {
    if (initial) {
      return keysFromExpense(initial);
    }
    return members[0] ? [`u:${members[0].user_id}`] : [];
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
      setAmount(initial.amount);
      setPayerKey(payerKeyFromExpense(initial));
      setParticipantKeys(keysFromExpense(initial));
    } else {
      setName("");
      setDescription("");
      setAmount("");
      setPayerKey(members[0] ? `u:${members[0].user_id}` : "");
      setParticipantKeys(members[0] ? [`u:${members[0].user_id}`] : []);
    }
  }, [initial, members]);

  const toggleKey = (key: string) => {
    setParticipantKeys((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const values = {
      name,
      description,
      amount,
      payerKey,
      participantKeys,
    };
    const err = validateExpenseForm(values);
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    onSubmit(keysToCreateBody(name, description, amount, payerKey, participantKeys));
  };

  return (
    <form id="expense-form" className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Title"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        label="Amount"
        name="amount"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        required
      />

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-stone-600">Paid by</span>
        <select
          name="payer"
          className="rounded-md border border-violet-200/80 bg-white px-3 py-2 text-stone-800"
          value={payerKey}
          onChange={(e) => setPayerKey(e.target.value)}
        >
          <option value="">Select payer</option>
          <optgroup label="Trip members">
            {members.map((m) => (
              <option key={m.user_id} value={`u:${m.user_id}`}>
                {m.display_name}
              </option>
            ))}
          </optgroup>
          {unauthorizedUsers.length ? (
            <optgroup label="Not in app">
              {unauthorizedUsers.map((u) => (
                <option key={u.id} value={`au:${u.id}`}>
                  {u.display_name}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-stone-600">Split between</span>
        <p className="text-xs text-stone-500">
          Choose who owes a share of this expense. The payer does not have to be
          included.
        </p>
        <div className="flex flex-col gap-3 rounded-md border border-violet-200/70 bg-violet-50/30 p-3">
          <div>
            <span className="text-xs font-semibold uppercase text-stone-500">
              Trip members
            </span>
            <div className="mt-2 flex flex-col gap-2">
              {members.map((m) => {
                const key = `u:${m.user_id}`;
                return (
                  <label
                    key={m.user_id}
                    className="flex cursor-pointer items-center gap-2 text-stone-700"
                  >
                    <input
                      type="checkbox"
                      checked={participantKeys.includes(key)}
                      onChange={() => toggleKey(key)}
                    />
                    {m.display_name}
                  </label>
                );
              })}
            </div>
          </div>
          {unauthorizedUsers.length ? (
            <div>
              <span className="text-xs font-semibold uppercase text-stone-500">
                Not in app
              </span>
              <div className="mt-2 flex flex-col gap-2">
                {unauthorizedUsers.map((u) => {
                  const key = `au:${u.id}`;
                  return (
                    <label
                      key={u.id}
                      className="flex cursor-pointer items-center gap-2 text-stone-700"
                    >
                      <input
                        type="checkbox"
                        checked={participantKeys.includes(key)}
                        onChange={() => toggleKey(key)}
                      />
                      {u.display_name}
                      <span className="text-xs text-stone-400">(name only)</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p className="text-sm text-rose-600">{formError}</p>
      ) : null}

      <Button type="submit" fullWidth disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
};
