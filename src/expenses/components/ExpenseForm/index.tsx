import type { FC, FormEvent } from "react";
import { useEffect, useState } from "react";

import { validateExpenseForm } from "./validation";
import type { ExpenseFormProps } from "./types";
import { Input } from "@/ui/components/Input";
import { Button } from "@/ui/components/Button";

export const ExpenseForm: FC<ExpenseFormProps> = ({
  members,
  initial,
  submitLabel,
  pending,
  onSubmit,
}) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [payerId, setPayerId] = useState(initial?.payer_id ?? "");
  const [participantIds, setParticipantIds] = useState<string[]>(
    initial?.participant_ids ?? (members[0] ? [members[0].user_id] : []),
  );
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
      setAmount(initial.amount);
      setPayerId(initial.payer_id);
      setParticipantIds(initial.participant_ids);
    } else {
      setName("");
      setDescription("");
      setAmount("");
      setPayerId(members[0]?.user_id ?? "");
      setParticipantIds(members[0] ? [members[0].user_id] : []);
    }
  }, [initial, members]);

  const toggleParticipant = (id: string) => {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const values = {
      name,
      description,
      amount,
      payer_id: payerId,
      participant_ids: participantIds,
    };
    const err = validateExpenseForm(values);
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    onSubmit(values);
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
        <span className="font-medium text-slate-200">Paid by</span>
        <select
          name="payer_id"
          className="rounded-md border border-slate-600/80 bg-slate-900/70 px-3 py-2 text-slate-100"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
        >
          <option value="">Select member</option>
          {members.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.display_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-200">Split between</span>
        <div className="flex flex-col gap-2 rounded-md border border-slate-600/50 p-3">
          {members.map((m) => (
            <label
              key={m.user_id}
              className="flex cursor-pointer items-center gap-2 text-slate-300"
            >
              <input
                type="checkbox"
                checked={participantIds.includes(m.user_id)}
                onChange={() => toggleParticipant(m.user_id)}
              />
              {m.display_name}
            </label>
          ))}
        </div>
      </div>

      {formError ? (
        <p className="text-sm text-red-400">{formError}</p>
      ) : null}

      <Button type="submit" fullWidth disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
};
