import { useCallback, useEffect, useState } from "react";

import { getLiff, initLiff, resetLiffInit } from "@/auth/services/liffService";

export interface UseLiffState {
  ready: boolean;
  error: string | null;
  inClient: boolean;
}

export function useLiff(): UseLiffState & { retry: () => void } {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inClient, setInClient] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const run = useCallback(() => {
    // let cancelled = false;
    (async () => {
      try {
        // console.log("initLiff");
        await initLiff(
          () => {
            console.log("initLiff done");

            const liff = getLiff();
            setInClient(liff.isInClient());
            setReady(true);
            setError(null);
          },
          (error) => {
            // console.error(error);
            setError(
              error instanceof Error ? error.message : "LIFF init failed",
            );
            setReady(false);
          },
        );
        // if (cancelled) {
        //   return;
        // }
        // console.log("initLiff done");
      } catch (e) {
        // if (!cancelled) {
        // setError(e instanceof Error ? e.message : "LIFF init failed");
        // setReady(false);
        console.error(e);
      }
      // }
    })();
    // return () => {
    //   cancelled = true;
    // };
  }, []);

  useEffect(() => {
    return run();
  }, [run, attempt]);

  const retry = useCallback(() => {
    resetLiffInit();
    setAttempt((a) => a + 1);
  }, []);

  return { ready, error, inClient, retry };
}
