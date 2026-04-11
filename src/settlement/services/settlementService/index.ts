import { apiClient } from "@/shared/api/client";

import type { SettlementResponse } from "@/settlement/types";

export async function getSettlement(
  tripId: string,
): Promise<SettlementResponse> {
  const { data } = await apiClient.get<SettlementResponse>(
    `/trips/${tripId}/summary`,
  );
  return data;
}
