import type { ExpenseResponse } from "@/expenses/types";
import type { TripMemberBrief } from "@/trips/types";

export interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  members: TripMemberBrief[];
  expense?: ExpenseResponse | null;
  mode: "create" | "edit";
}
