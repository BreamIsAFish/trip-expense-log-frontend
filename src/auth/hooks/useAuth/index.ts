import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { loginWithLineToken } from "@/auth/services/authService";
import { getLiff } from "@/auth/services/liffService";
import { useAuthStore } from "@/auth/stores/authStore";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const clear = useAuthStore((s) => s.clear);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const liff = getLiff();
      if (!liff.isLoggedIn()) {
        liff.login();
        throw new Error("redirecting");
      }
      const lineAccessToken = liff.getAccessToken();
      if (!lineAccessToken) {
        throw new Error("No LINE access token");
      }
      const res = await loginWithLineToken(lineAccessToken);
      setSession(res.access_token, res.user);
      return res;
    },
  });

  const login = useCallback(() => {
    return loginMutation.mutateAsync();
  }, [loginMutation]);

  const logout = useCallback(() => {
    clear();
    try {
      const liff = getLiff();
      if (liff.isLoggedIn()) {
        liff.logout();
      }
    } catch {
      /* ignore */
    }
  }, [clear]);

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
  };
}
