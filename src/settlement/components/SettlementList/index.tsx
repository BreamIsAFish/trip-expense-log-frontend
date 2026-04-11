import type { FC } from "react";

import { PaymentCard } from "@/settlement/components/PaymentCard";
import type { SettlementResponse } from "@/settlement/types";
import { formatCurrency } from "@/shared/utils/formatters";

import { Stack } from "./styles";

export const SettlementList: FC<{ data: SettlementResponse }> = ({ data }) => (
  <div className="space-y-8">
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-100">
        Simplified payments
      </h2>
      {data.payments.length === 0 ? (
        <p className="text-slate-500">Everyone is settled up.</p>
      ) : (
        <Stack>
          {data.payments.map((p, i) => (
            <PaymentCard key={`${p.from_user_id}-${p.to_user_id}-${i}`} payment={p} />
          ))}
        </Stack>
      )}
    </section>

    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-100">Balances</h2>
      <ul className="space-y-2 text-sm text-slate-300">
        {data.balances.map((b) => (
          <li
            key={b.user_id}
            className="flex justify-between rounded-md border border-slate-700/50 bg-slate-900/40 px-3 py-2"
          >
            <span>{b.display_name}</span>
            <span className="font-mono text-cyan-200">
              {formatCurrency(b.balance)}
            </span>
          </li>
        ))}
      </ul>
    </section>

    <p className="text-sm text-slate-500">
      Trip total:{" "}
      <span className="font-mono text-slate-300">
        {formatCurrency(data.total_amount)}
      </span>
    </p>
  </div>
);
