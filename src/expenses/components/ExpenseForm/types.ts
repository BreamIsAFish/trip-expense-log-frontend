import type { ExpenseResponse } from "@/expenses/types";
import type { TripMemberBrief } from "@/trips/types";

export interface ExpenseFormProps {
  members: TripMemberBrief[];
  initial?: ExpenseResponse | null;
  submitLabel: string;
  pending?: boolean;
  onSubmit: (values: {
    name: string;
    description: string;
    amount: string;
    payer_id: string;
    participant_ids: string[];
  }) => void;
}
