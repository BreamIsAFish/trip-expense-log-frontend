import { apiClient } from "@/shared/api/client";

import type { ExpenseResponse } from "@/expenses/types";

export type ExpenseParticipantPayload =
  | { type: "user"; user_id: string; unauthorized_user_id?: undefined }
  | {
      type: "unauthorized_user";
      unauthorized_user_id: string;
      user_id?: undefined;
    };

export type CreateUpdateExpenseBody = {
  name: string;
  description: string;
  amount: string;
  payer_type: "user" | "unauthorized_user";
  payer_id?: string;
  payer_unauthorized_user_id?: string;
  participants: ExpenseParticipantPayload[];
};

export async function listExpenses(tripId: string): Promise<ExpenseResponse[]> {
  const { data } = await apiClient.get<ExpenseResponse[]>(
    `/trips/${tripId}/expenses`,
  );
  return data;
}

export async function createExpense(
  tripId: string,
  body: CreateUpdateExpenseBody,
): Promise<ExpenseResponse> {
  const { data } = await apiClient.post<ExpenseResponse>(
    `/trips/${tripId}/expenses`,
    body,
  );
  return data;
}

export async function updateExpense(
  expenseId: string,
  body: CreateUpdateExpenseBody,
): Promise<ExpenseResponse> {
  const { data } = await apiClient.put<ExpenseResponse>(
    `/expenses/${expenseId}`,
    body,
  );
  return data;
}

export async function deleteExpense(expenseId: string): Promise<void> {
  await apiClient.delete(`/expenses/${expenseId}`);
}
