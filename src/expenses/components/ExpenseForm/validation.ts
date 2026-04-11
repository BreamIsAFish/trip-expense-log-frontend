import { isNonEmptyString, isPositiveDecimalString } from "@/shared/utils/validators";

export interface ExpenseFormValues {
  name: string;
  description: string;
  amount: string;
  payer_id: string;
  participant_ids: string[];
}

export function validateExpenseForm(v: ExpenseFormValues): string | null {
  if (!isNonEmptyString(v.name)) {
    return "Name is required";
  }
  if (!isPositiveDecimalString(v.amount)) {
    return "Enter a valid amount greater than zero";
  }
  if (!isNonEmptyString(v.payer_id)) {
    return "Select who paid";
  }
  if (!v.participant_ids.length) {
    return "Select at least one participant";
  }
  return null;
}
