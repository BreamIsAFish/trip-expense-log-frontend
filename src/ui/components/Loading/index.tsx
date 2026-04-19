import type { FC } from "react";

export const Loading: FC<{ label?: string }> = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-stone-600">
    <div
      className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500/25 border-t-brand-600"
      aria-hidden
    />
    <p className="text-sm text-stone-500">{label}</p>
  </div>
);
