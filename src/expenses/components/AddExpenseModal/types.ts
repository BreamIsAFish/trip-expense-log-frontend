import type { ExpenseResponse } from "@/expenses/types";
import type { UnauthorizedUserBrief, TripMemberBrief } from "@/trips/types";

export interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  members: TripMemberBrief[];
  unauthorizedUsers: UnauthorizedUserBrief[];
  mode: "create" | "edit";
  expense?: ExpenseResponse;
}
