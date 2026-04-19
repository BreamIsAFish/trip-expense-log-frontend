import { apiClient } from "@/shared/api/client";

import type { UnauthorizedUserBrief } from "@/trips/types";

export interface UnauthorizedUserResponse {
  id: string;
  trip_id: string;
  display_name: string;
  created_by: string;
  created_at: string;
}

export async function listUnauthorizedUsers(
  tripId: string,
): Promise<{ unauthorized_users: UnauthorizedUserResponse[] }> {
  const { data } = await apiClient.get<{
    unauthorized_users: UnauthorizedUserResponse[];
  }>(`/trips/${tripId}/unauthorized-users`);
  return data;
}

export async function addUnauthorizedUser(
  tripId: string,
  displayName: string,
): Promise<UnauthorizedUserResponse> {
  const { data } = await apiClient.post<UnauthorizedUserResponse>(
    `/trips/${tripId}/unauthorized-users`,
    { display_name: displayName },
  );
  return data;
}

export async function deleteUnauthorizedUser(
  unauthorizedUserId: string,
): Promise<void> {
  await apiClient.delete(`/unauthorized-users/${unauthorizedUserId}`);
}

export function toBrief(u: UnauthorizedUserResponse): UnauthorizedUserBrief {
  return { id: u.id, display_name: u.display_name };
}
