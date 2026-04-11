import { useQuery } from "@tanstack/react-query";

import { listExpenses } from "@/expenses/services/expenseService";

export function useExpenses(tripId: string | undefined) {
  return useQuery({
    queryKey: ["expenses", tripId],
    queryFn: () => listExpenses(tripId as string),
    enabled: Boolean(tripId),
  });
}
