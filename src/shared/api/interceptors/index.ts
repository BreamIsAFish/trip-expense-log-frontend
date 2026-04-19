import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { handleSessionExpired } from "@/auth/session/handleSessionExpired";
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

function isAuthLoginPost(config: InternalAxiosRequestConfig | undefined): boolean {
  if (!config?.url) {
    return false;
  }
  if (config.method?.toLowerCase() !== "post") {
    return false;
  }
  const path = config.url.replace(/\?.*$/, "");
  return path === "/auth/login" || path.endsWith("/auth/login");
}

export function attachUnauthorizedResponseInterceptor(): void {
  apiClient.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (error.response?.status === 401 && !isAuthLoginPost(error.config)) {
        handleSessionExpired();
      }
      return Promise.reject(error);
    },
  );
}
