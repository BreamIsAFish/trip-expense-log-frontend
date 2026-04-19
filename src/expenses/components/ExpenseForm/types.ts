import type { ExpenseResponse } from "@/expenses/types";
import type { UnauthorizedUserBrief, TripMemberBrief } from "@/trips/types";

import type { CreateUpdateExpenseBody } from "@/expenses/services/expenseService";

export interface ExpenseFormProps {
  members: TripMemberBrief[];
  unauthorizedUsers: UnauthorizedUserBrief[];
  initial: ExpenseResponse | null;
  submitLabel: string;
  pending: boolean;
  onSubmit: (values: CreateUpdateExpenseBody) => void;
}
