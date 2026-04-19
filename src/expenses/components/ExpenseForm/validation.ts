import { isNonEmptyString, isPositiveDecimalString } from "@/shared/utils/validators";

export interface ExpenseFormValues {
  name: string;
  description: string;
  amount: string;
  /** Who paid: `u:<uuid>` (trip member) or `au:<uuid>` (unauthorized user) */
  payerKey: string;
  /** Keys like `u:<uuid>` or `au:<uuid>` */
  participantKeys: string[];
}

export function validateExpenseForm(v: ExpenseFormValues): string | null {
  if (!isNonEmptyString(v.name)) {
    return "Name is required";
  }
  if (!isPositiveDecimalString(v.amount)) {
    return "Enter a valid amount greater than zero";
  }
  if (!isNonEmptyString(v.payerKey)) {
    return "Select who paid";
  }
  if (!v.payerKey.startsWith("u:") && !v.payerKey.startsWith("au:")) {
    return "Select who paid";
  }
  if (!v.participantKeys.length) {
    return "Select at least one participant";
  }
  return null;
}
