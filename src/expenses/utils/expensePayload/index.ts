import type {
  CreateUpdateExpenseBody,
  ExpenseParticipantPayload,
} from "@/expenses/services/expenseService";

export function keysToParticipants(keys: string[]): ExpenseParticipantPayload[] {
  return keys.map((k) => {
    if (k.startsWith("u:")) {
      return { type: "user" as const, user_id: k.slice(2) };
    }
    return { type: "unauthorized_user" as const, unauthorized_user_id: k.slice(3) };
  });
}

/** Maps `u:<uuid>` / `au:<uuid>` keys to API expense body (same logic as ExpenseForm). */
export function keysToCreateBody(
  name: string,
  description: string,
  amount: string,
  payerKey: string,
  participantKeys: string[],
): CreateUpdateExpenseBody {
  let payer_type: "user" | "unauthorized_user";
  let payer_id: string | undefined;
  let payer_unauthorized_user_id: string | undefined;
  if (payerKey.startsWith("u:")) {
    payer_type = "user";
    payer_id = payerKey.slice(2);
  } else {
    payer_type = "unauthorized_user";
    payer_unauthorized_user_id = payerKey.slice(3);
  }
  return {
    name,
    description,
    amount,
    payer_type,
    payer_id,
    payer_unauthorized_user_id,
    participants: keysToParticipants(participantKeys),
  };
}
