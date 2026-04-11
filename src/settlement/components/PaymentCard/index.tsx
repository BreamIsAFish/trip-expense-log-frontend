import type { FC } from "react";

import { formatCurrency } from "@/shared/utils/formatters";

import type { PaymentCardProps } from "./types";

export const PaymentCard: FC<PaymentCardProps> = ({ payment }) => (
  <div className="rounded-lg border border-slate-600/40 bg-slate-900/60 px-4 py-3 text-slate-100">
    <p className="text-sm">
      <strong>{payment.from_display_name}</strong>
      <span className="text-slate-400"> pays </span>
      <strong>{payment.to_display_name}</strong>
    </p>
    <p className="mt-1 font-mono text-lg text-cyan-300">
      {formatCurrency(payment.amount)}
    </p>
  </div>
);
