import liff from "@line/liff";

let initPromise: Promise<void> | null = null;

export function resetLiffInit(): void {
  initPromise = null;
}

export function getLiffId(): string {
  const id = import.meta.env.VITE_LIFF_ID;
  if (!id) {
    throw new Error("VITE_LIFF_ID is not set");
  }
  return id;
}

export async function initLiff(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }
  initPromise = liff.init({ liffId: getLiffId() });
  return initPromise;
}

export function getLiff(): typeof liff {
  return liff;
}
