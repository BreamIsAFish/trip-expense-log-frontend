import type { FC } from "react";

import { PaymentCard } from "@/settlement/components/PaymentCard";
import type { SettlementResponse } from "@/settlement/types";
import { formatCurrency } from "@/shared/utils/formatters";

import { Stack } from "./styles";

function balanceKey(b: SettlementResponse["balances"][0]): string {
  if (b.kind === "user" && b.user_id) {
    return `u:${b.user_id}`;
  }
  if (b.kind === "unauthorized_user" && b.unauthorized_user_id) {
    return `au:${b.unauthorized_user_id}`;
  }
  return b.display_name;
}

function paymentKey(
  p: SettlementResponse["payments"][0],
  i: number,
): string {
  const from =
    p.from_kind === "user"
      ? `u:${p.from_user_id ?? ""}`
      : `au:${p.from_unauthorized_user_id ?? ""}`;
  const to =
    p.to_kind === "user"
      ? `u:${p.to_user_id ?? ""}`
      : `au:${p.to_unauthorized_user_id ?? ""}`;
  return `${from}->${to}-${i}`;
}

export const SettlementList: FC<{ data: SettlementResponse }> = ({ data }) => (
  <div className="space-y-8">
    <section>
      <h2 className="mb-3 text-lg font-semibold text-stone-800">
        Simplified payments
      </h2>
      {data.payments.length === 0 ? (
        <p className="text-stone-500">Everyone is settled up.</p>
      ) : (
        <Stack>
          {data.payments.map((p, i) => (
            <PaymentCard key={paymentKey(p, i)} payment={p} />
          ))}
        </Stack>
      )}
    </section>

    <section>
      <h2 className="mb-3 text-lg font-semibold text-stone-800">Balances</h2>
      <ul className="space-y-2 text-sm text-stone-600">
        {data.balances.map((b) => (
          <li
            key={balanceKey(b)}
            className="flex justify-between rounded-md border border-violet-200/80 bg-white px-3 py-2 shadow-sm"
          >
            <span>
              {b.display_name}
              {b.kind === "unauthorized_user" ? (
                <span className="ml-2 text-xs text-stone-400">(not in app)</span>
              ) : null}
            </span>
            <span className="font-mono font-medium text-brand-700">
              {formatCurrency(b.balance)}
            </span>
          </li>
        ))}
      </ul>
    </section>

    <p className="text-sm text-stone-500">
      Trip total:{" "}
      <span className="font-mono text-stone-700">
        {formatCurrency(data.total_amount)}
      </span>
    </p>
  </div>
);
