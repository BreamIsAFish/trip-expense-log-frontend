import type { UuidString } from "@/shared/types/common";

export type ParticipantType = "user" | "unauthorized_user";

export type PayerType = "user" | "unauthorized_user";

export interface ExpenseParticipant {
  type: ParticipantType;
  user_id?: UuidString;
  display_name?: string;
  unauthorized_user_id?: UuidString;
  name?: string;
}

export interface ExpenseResponse {
  id: UuidString;
  trip_id: UuidString;
  payer_type: PayerType;
  payer_id?: UuidString;
  payer_unauthorized_user_id?: UuidString;
  payer_name: string;
  name: string;
  description: string;
  amount: string;
  participants: ExpenseParticipant[];
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
