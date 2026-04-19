import { Link, useParams } from "react-router-dom";

import { useSettlement } from "@/settlement/hooks/useSettlement";
import { SettlementList } from "@/settlement/components/SettlementList";
import { Loading } from "@/ui/components/Loading";
import { PageShell } from "@/ui/styles";

export function SettlementPage() {
  const { id } = useParams<{ id: string }>();
  const tripId = id ?? "";
  const { data, isLoading, error } = useSettlement(tripId);

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

        {isLoading ? (
          <Loading label="Calculating…" />
        ) : error ? (
          <p className="text-rose-600">
            {error instanceof Error ? error.message : "Could not load summary"}
          </p>
        ) : data ? (
          <SettlementList data={data} />
        ) : null}
      </div>
    </PageShell>
  );
}
