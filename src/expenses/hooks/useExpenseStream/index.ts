import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useAuthStore } from "@/auth/stores/authStore";
import { streamTripExpenses } from "@/expenses/services/sseService";

const RECONNECT_MS = 4000;

export function useExpenseStream(tripId: string | undefined): void {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  const reconnectRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tripId || !token) {
      return;
    }

    const ac = new AbortController();

    const connect = () => {
      void streamTripExpenses(
        tripId,
        token,
        () => {
          void qc.invalidateQueries({ queryKey: ["expenses", tripId] });
        },
        ac.signal,
      ).catch(() => {
        if (ac.signal.aborted) {
          return;
        }
        reconnectRef.current = window.setTimeout(connect, RECONNECT_MS);
      });
    };

    connect();

    return () => {
      ac.abort();
      if (reconnectRef.current) {
        window.clearTimeout(reconnectRef.current);
      }
    };
  }, [tripId, token, qc]);
}
