import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AUTH_STORAGE_KEY } from "@/auth/constants";
import type { UserBrief } from "@/auth/types";

interface AuthState {
  token: string | null;
  user: UserBrief | null;
  setSession: (token: string, user: UserBrief) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clear: () => set({ token: null, user: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
);
