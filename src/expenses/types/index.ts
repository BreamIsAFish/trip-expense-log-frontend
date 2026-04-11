import type { UuidString } from "@/shared/types/common";

export interface ExpenseResponse {
  id: UuidString;
  trip_id: UuidString;
  payer_id: UuidString;
  payer_name: string;
  name: string;
  description: string;
  amount: string;
  participant_ids: UuidString[];
  created_at: string;
  updated_at: string;
}

export type ExpenseStreamType =
  | "expense.created"
  | "expense.updated"
  | "expense.deleted";

export interface ExpenseStreamPayload {
  type: ExpenseStreamType;
  data?: { expense_id?: string };
}
