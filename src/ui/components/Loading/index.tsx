import type { FC } from "react";

export const Loading: FC<{ label?: string }> = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-200">
    <div
      className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400"
      aria-hidden
    />
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);
