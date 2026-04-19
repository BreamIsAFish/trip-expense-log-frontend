import { apiClient } from "@/shared/api/client";

import type { TripDetailResponse, TripResponse } from "@/trips/types";

export async function listTrips(): Promise<TripResponse[]> {
  const { data } = await apiClient.get<TripResponse[]>("/trips");
  return data;
}

export async function getTrip(id: string): Promise<TripDetailResponse> {
  const { data } = await apiClient.get<TripDetailResponse>(`/trips/${id}`);
  return data;
}

export async function createTrip(body: {
  name: string;
  description: string;
}): Promise<TripResponse> {
  const { data } = await apiClient.post<TripResponse>("/trips", body);
  return data;
}

export async function joinTripByInviteCode(inviteCode: string): Promise<void> {
  await apiClient.post("/trips/join", {
    invite_code: inviteCode.trim(),
  });
}

export async function leaveTrip(tripId: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/leave`);
}
