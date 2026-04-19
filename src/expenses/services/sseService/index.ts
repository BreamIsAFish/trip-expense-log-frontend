import type { ExpenseStreamPayload } from "@/expenses/types";
import { handleSessionExpired } from "@/auth/session/handleSessionExpired";
import { getApiBaseUrl } from "@/shared/api/baseUrl";

/**
 * Parse one or more SSE `data:` lines from a chunk of text.
 */
export function parseSseDataLines(buffer: string): {
  events: ExpenseStreamPayload[];
  rest: string;
} {
  const events: ExpenseStreamPayload[] = [];
  const parts = buffer.split("\n\n");
  const complete = parts.slice(0, -1);
  const rest = parts[parts.length - 1] ?? "";

  for (const block of complete) {
    for (const line of block.split("\n")) {
      if (line.startsWith("data:")) {
        const json = line.slice(5).trim();
        if (!json || json.startsWith(":")) {
          continue;
        }
        try {
          const parsed = JSON.parse(json) as ExpenseStreamPayload;
          events.push(parsed);
        } catch {
          /* ignore malformed */
        }
      }
    }
  }

  return { events, rest };
}

export function streamTripExpenses(
  tripId: string,
  token: string,
  onEvent: (ev: ExpenseStreamPayload) => void,
  signal: AbortSignal,
): Promise<void> {
  const url = `${getApiBaseUrl()}/trips/${tripId}/stream`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
    },
    signal,
  }).then(async (res) => {
    if (res.status === 401) {
      handleSessionExpired();
      throw new Error(`SSE failed: ${res.status}`);
    }
    if (!res.ok || !res.body) {
      throw new Error(`SSE failed: ${res.status}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (!signal.aborted) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      buf += decoder.decode(value, { stream: true });
      const { events, rest } = parseSseDataLines(buf);
      buf = rest;
      for (const ev of events) {
        onEvent(ev);
      }
    }
  });
}
