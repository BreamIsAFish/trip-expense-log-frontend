import type { FC } from "react";
import { useEffect } from "react";

import { useAuth } from "@/auth/hooks/useAuth";
import { useLiff } from "@/auth/hooks/useLiff";
import { Button } from "@/ui/components/Button";
import { Loading } from "@/ui/components/Loading";

import type { LiffInitializerProps } from "./types";
// import liff from "@line/liff";
// import { getLiffId, initLiff } from "@/auth/services/liffService";

export const LiffInitializer: FC<LiffInitializerProps> = ({ children }) => {
  const { ready, error, retry } = useLiff();
  const {
    login: lineLogin,
    isAuthenticated,
    loginPending,
    loginError,
  } = useAuth();

  useEffect(() => {
    console.log("ready", ready);
    console.log("error", error);
    console.log("isAuthenticated", isAuthenticated);
    console.log("loginPending", loginPending);
    console.log("loginError", loginError);

    if (!ready || isAuthenticated) {
      return;
    }

    const login = async () => {
      try {
        await lineLogin();
      } catch (error) {
        console.error(error);
      }
    };

    login();

    // const initLiff = async () => {
    //   try {
    //     console.log(liff.isLoggedIn());
    //     liff.login();
    //     await liff.init(
    //       { liffId: getLiffId() },
    //       async () => {
    //         console.log(await liff.getProfile(), liff.getAccessToken());
    //         console.log("initLiff done!!!!!!");
    //       },
    //       (error) => {
    //         console.error(error);
    //       },
    //     );
    //     console.log("eiei");
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // initLiff();
  }, [ready, isAuthenticated]);

  if (!import.meta.env.VITE_LIFF_ID) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#f9f7ff] px-4 text-center text-stone-700">
        <p className="text-lg font-semibold">Configuration required</p>
        <p className="max-w-md text-sm text-stone-500">
          Set <code className="text-brand-700">VITE_LIFF_ID</code> in{" "}
          <code className="text-brand-700">.env.local</code>.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f9f7ff] px-4 text-center text-stone-700">
        <p className="text-lg font-semibold">LIFF could not start</p>
        <p className="max-w-md text-sm text-stone-500">{error}</p>
        <Button
          type="button"
          onClick={retry}
        >
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f9f7ff] px-4 text-center text-stone-700">
        <p className="text-lg font-semibold">Sign-in failed</p>
        <p className="max-w-md text-sm text-stone-500">{msg}</p>
        <Button
          type="button"
          onClick={lineLogin}
        >
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
