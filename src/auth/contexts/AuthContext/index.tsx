import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { UserBrief } from "@/auth/types";

export interface AuthContextValue {
  user: UserBrief | null;
  token: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthContextProvider({
  value,
  children,
}: {
  value: AuthContextValue;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return ctx;
}
