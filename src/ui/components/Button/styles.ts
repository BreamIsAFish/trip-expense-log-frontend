import type { ButtonVariant } from "./types";

export const buttonVariantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm border border-cyan-500/40",
  secondary:
    "bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-600/60",
  ghost:
    "bg-transparent hover:bg-slate-800/60 text-slate-100 border border-transparent",
  danger: "bg-red-600/90 hover:bg-red-500 text-white border border-red-500/40",
};
