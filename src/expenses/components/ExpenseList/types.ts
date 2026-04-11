import type { ExpenseResponse } from "@/expenses/types";
import type { TripMemberBrief } from "@/trips/types";

export interface ExpenseListProps {
  tripId: string;
  expenses: ExpenseResponse[];
  isLoading: boolean;
  error: unknown;
  members: TripMemberBrief[];
  currentUserId: string;
  onEditExpense: (expense: ExpenseResponse) => void;
}
