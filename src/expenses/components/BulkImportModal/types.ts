import type { CreateUpdateExpenseBody } from "@/expenses/services/expenseService";
import type { UnauthorizedUserBrief, TripMemberBrief } from "@/trips/types";

/** Local id for React keys and stable row identity in the import modal */
export interface DraftExpense extends CreateUpdateExpenseBody {
  _id: string;
  _errors?: string[];
}

export interface BulkImportModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  members: TripMemberBrief[];
  unauthorizedUsers: UnauthorizedUserBrief[];
  initialDrafts: DraftExpense[];
}
