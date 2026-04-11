import type { ExpenseResponse } from "@/expenses/types";
import type { TripMemberBrief } from "@/trips/types";

export interface ExpenseCardProps {
  expense: ExpenseResponse;
  members: TripMemberBrief[];
  currentUserId: string;
  onEdit: (expense: ExpenseResponse) => void;
  onDelete: (expense: ExpenseResponse) => void;
}
