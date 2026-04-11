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
        <span className="font-medium text-slate-200">{label}</span>
      ) : null}
      <input
        id={inputId}
        className="rounded-md border border-slate-600/80 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-cyan-500/40 focus:border-cyan-500/60 focus:ring-2"
        {...rest}
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  );
};
