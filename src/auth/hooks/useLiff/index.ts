import { useCallback, useEffect, useState } from "react";

import {
  getLiff,
  getLiffId,
  initLiff,
  resetLiffInit,
} from "@/auth/services/liffService";

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
    let cancelled = false;
    (async () => {
      try {
        if (!import.meta.env.VITE_LIFF_ID) {
          throw new Error("Missing VITE_LIFF_ID");
        }
        getLiffId();
        await initLiff();
        if (cancelled) {
          return;
        }
        const liff = getLiff();
        setInClient(liff.isInClient());
        setReady(true);
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "LIFF init failed");
          setReady(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
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
