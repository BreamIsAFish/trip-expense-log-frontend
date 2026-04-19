import type { FC } from "react";

import type { InputProps } from "./types";

export const Input: FC<InputProps> = ({
  label,
  error,
  className = "",
  id,
  ...rest
}) => {
  const inputId = id ?? rest.name;
  return (
    <label className={`flex flex-col gap-1 text-sm ${className}`}>
      {label ? (
        <span className="font-medium text-stone-600">{label}</span>
      ) : null}
      <input
        id={inputId}
        className="rounded-md border border-violet-200/80 bg-white px-3 py-2 text-stone-800 outline-none ring-brand-500/25 focus:border-brand-500/50 focus:ring-2"
        {...rest}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
};
