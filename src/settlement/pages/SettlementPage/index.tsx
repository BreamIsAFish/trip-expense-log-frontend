import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useExpenses } from "@/expenses/hooks/useExpenses";
import { SettlementList } from "@/settlement/components/SettlementList";
import { useSettlement } from "@/settlement/hooks/useSettlement";
import type { MemberExpenseTotal } from "@/settlement/types";
import { Loading } from "@/ui/components/Loading";
import { PageShell } from "@/ui/styles";

function partyKeyFromBalance(b: {
  kind: string;
  user_id?: string;
  unauthorized_user_id?: string;
  display_name: string;
}): string {
  if (b.kind === "user" && b.user_id) {
    return `u:${b.user_id}`;
  }
  if (b.kind === "unauthorized_user" && b.unauthorized_user_id) {
    return `au:${b.unauthorized_user_id}`;
  }
  return b.display_name;
}

export function SettlementPage() {
  const { id } = useParams<{ id: string }>();
  const tripId = id ?? "";
  const { data, isLoading, error } = useSettlement(tripId);
  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expensesError,
  } = useExpenses(tripId);

  const memberTotals = useMemo((): MemberExpenseTotal[] => {
    if (!data) {
      return [];
    }
    const byKey = new Map<string, MemberExpenseTotal>();

    for (const b of data.balances) {
      const key = partyKeyFromBalance(b);
      byKey.set(key, {
        display_name: b.display_name,
        total: 0,
        kind: b.kind,
      });
    }

    for (const e of expenses ?? []) {
      const amt = Number.parseFloat(e.amount);
      if (Number.isNaN(amt)) {
        continue;
      }
      let payerKey: string | undefined;
      if (e.payer_type === "user" && e.payer_id) {
        payerKey = `u:${e.payer_id}`;
      } else if (
        e.payer_type === "unauthorized_user" &&
        e.payer_unauthorized_user_id
      ) {
        payerKey = `au:${e.payer_unauthorized_user_id}`;
      }
      if (!payerKey) {
        continue;
      }
      const existing = byKey.get(payerKey);
      if (existing) {
        existing.total += amt;
      } else {
        byKey.set(payerKey, {
          display_name: e.payer_name,
          total: amt,
          kind: e.payer_type,
        });
      }
    }

    return Array.from(byKey.values()).sort((a, b) =>
      a.display_name.localeCompare(b.display_name),
    );
  }, [data, expenses]);

  const pageLoading = isLoading || (Boolean(data) && expensesLoading);

  return (
    <PageShell className="px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <Link
            to={`/trips/${tripId}`}
            className="text-sm text-brand-700 hover:text-brand-600"
          >
            ← Back to trip
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-stone-800">Settlement</h1>
          <p className="mt-1 text-sm text-stone-500">
            Who should pay whom to settle shared costs.
          </p>
        </div>

        {pageLoading ? (
          <Loading label="Calculating…" />
        ) : error ? (
          <p className="text-rose-600">
            {error instanceof Error ? error.message : "Could not load summary"}
          </p>
        ) : data && expensesError ? (
          <p className="text-rose-600">
            {expensesError instanceof Error
              ? expensesError.message
              : "Could not load expenses for totals"}
          </p>
        ) : data ? (
          <SettlementList data={data} memberTotals={memberTotals} />
        ) : null}
      </div>
    </PageShell>
  );
}
