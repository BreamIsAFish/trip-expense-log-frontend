import { apiClient } from "@/shared/api/client";

import type { LoginResponse } from "@/auth/types";

export async function loginWithLineToken(
  lineAccessToken: string,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    line_access_token: lineAccessToken,
  });
  return data;
}
