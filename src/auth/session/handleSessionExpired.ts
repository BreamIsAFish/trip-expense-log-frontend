import { getLiff } from "@/auth/services/liffService";
import { useAuthStore } from "@/auth/stores/authStore";
import { queryClient } from "@/shared/queryClient";

export function handleSessionExpired(): void {
  useAuthStore.getState().clear();
  queryClient.clear();
  try {
    const liff = getLiff();
    if (liff.isLoggedIn()) {
      liff.logout();
    }
  } catch {
    /* ignore */
  }
}
