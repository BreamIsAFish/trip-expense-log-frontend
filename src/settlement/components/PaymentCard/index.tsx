import type { FC } from "react";

import { formatCurrency } from "@/shared/utils/formatters";

import type { PaymentCardProps } from "./types";

export const PaymentCard: FC<PaymentCardProps> = ({ payment }) => (
  <div className="rounded-lg border border-violet-200/80 bg-white px-4 py-3 text-stone-800 shadow-sm">
    <p className="text-sm">
      <strong>{payment.from_display_name}</strong>
      {payment.from_kind === "unauthorized_user" ? (
        <span className="text-xs text-stone-400"> (not in app)</span>
      ) : null}
      <span className="text-stone-500"> pays </span>
      <strong>{payment.to_display_name}</strong>
      {payment.to_kind === "unauthorized_user" ? (
        <span className="text-xs text-stone-400"> (not in app)</span>
      ) : null}
    </p>
    <p className="mt-1 font-mono text-lg font-medium text-brand-700">
      {formatCurrency(payment.amount)}
    </p>
  </div>
);
