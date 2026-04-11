import type { FC } from "react";

import { buttonVariantClass } from "./styles";
import type { ButtonProps } from "./types";

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  disabled,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition border";
  const width = fullWidth ? "w-full" : "";
  const state = disabled ? "opacity-55 cursor-not-allowed" : "cursor-pointer";
  const v = buttonVariantClass[variant];
  return (
    <button
      type="button"
      className={`${base} ${v} ${width} ${state} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
