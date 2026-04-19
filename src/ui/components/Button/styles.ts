import type { ButtonVariant } from "./types";

export const buttonVariantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 hover:bg-brand-500 text-white shadow-sm border border-brand-500/35",
  secondary:
    "bg-white hover:bg-violet-50/80 text-stone-700 border border-violet-200/80 shadow-sm",
  ghost:
    "bg-transparent hover:bg-violet-100/50 text-stone-600 border border-transparent",
  danger:
    "bg-rose-400/95 hover:bg-rose-400 text-white border border-rose-300/60 shadow-sm",
};
