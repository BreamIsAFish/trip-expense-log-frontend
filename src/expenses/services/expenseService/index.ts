import { apiClient } from "@/shared/api/client";

import type { ExpenseResponse } from "@/expenses/types";

export async function listExpenses(tripId: string): Promise<ExpenseResponse[]> {
  const { data } = await apiClient.get<ExpenseResponse[]>(
    `/trips/${tripId}/expenses`,
  );
  return data;
}

export async function createExpense(
  tripId: string,
  body: {
    name: string;
    description: string;
    amount: string;
    payer_id: string;
    participant_ids: string[];
  },
): Promise<ExpenseResponse> {
  const { data } = await apiClient.post<ExpenseResponse>(
    `/trips/${tripId}/expenses`,
    body,
  );
  return data;
}

export async function updateExpense(
  expenseId: string,
  body: {
    name: string;
    description: string;
    amount: string;
    payer_id: string;
    participant_ids: string[];
  },
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
