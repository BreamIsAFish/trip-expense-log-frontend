import type { FC, ReactNode } from "react";
import { useMemo } from "react";

import { AuthContextProvider } from "@/auth/contexts/AuthContext";
import { useAuth } from "@/auth/hooks/useAuth";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();

  const value = useMemo(
    () => ({ user, token, isAuthenticated }),
    [user, token, isAuthenticated],
  );

  return (
    <AuthContextProvider value={value}>{children}</AuthContextProvider>
  );
};
