import type { InternalAxiosRequestConfig } from "axios";

import { apiClient } from "@/shared/api/client";

export function attachAuthInterceptor(getToken: () => string | null): void {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
