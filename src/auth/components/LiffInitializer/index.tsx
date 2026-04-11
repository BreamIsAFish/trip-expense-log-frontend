import type { FC } from "react";
import { useEffect } from "react";

import { useAuth } from "@/auth/hooks/useAuth";
import { useLiff } from "@/auth/hooks/useLiff";
import { Button } from "@/ui/components/Button";
import { Loading } from "@/ui/components/Loading";

import type { LiffInitializerProps } from "./types";

export const LiffInitializer: FC<LiffInitializerProps> = ({ children }) => {
  const { ready, error, retry } = useLiff();
  const { login, isAuthenticated, loginPending, loginError } = useAuth();

  useEffect(() => {
    if (!ready || isAuthenticated) {
      return;
    }
    void login().catch(() => {
      /* mutation surfaces error */
    });
  }, [ready, isAuthenticated, login]);

  if (!import.meta.env.VITE_LIFF_ID) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-950 px-4 text-center text-slate-200">
        <p className="text-lg font-semibold">Configuration required</p>
        <p className="max-w-md text-sm text-slate-400">
          Set <code className="text-cyan-400">VITE_LIFF_ID</code> in{" "}
          <code className="text-cyan-400">.env.local</code>.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-slate-200">
        <p className="text-lg font-semibold">LIFF could not start</p>
        <p className="max-w-md text-sm text-slate-400">{error}</p>
        <Button type="button" onClick={retry}>
          Retry
        </Button>
      </div>
    );
  }

  if (!ready || loginPending) {
    return <Loading label="Connecting to LINE…" />;
  }

  if (loginError && !isAuthenticated) {
    const msg =
      loginError instanceof Error ? loginError.message : "Login failed";
    if (msg === "redirecting") {
      return <Loading label="Opening LINE login…" />;
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-slate-200">
        <p className="text-lg font-semibold">Sign-in failed</p>
        <p className="max-w-md text-sm text-slate-400">{msg}</p>
        <Button type="button" onClick={() => void login()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Loading label="Authenticating…" />;
  }

  return <>{children}</>;
};
