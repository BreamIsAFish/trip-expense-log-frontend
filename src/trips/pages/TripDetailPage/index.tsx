import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "@/auth/hooks/useAuth";
import { useTripDetail } from "@/trips/hooks/useTripDetail";
import { leaveTrip } from "@/trips/services/tripService";
import { ExpenseList } from "@/expenses/components/ExpenseList";
import { AddExpenseModal } from "@/expenses/components/AddExpenseModal";
import { useExpenses } from "@/expenses/hooks/useExpenses";
import { useExpenseStream } from "@/expenses/hooks/useExpenseStream";
import type { ExpenseResponse } from "@/expenses/types";
import { Button } from "@/ui/components/Button";
import { Loading } from "@/ui/components/Loading";
import { PageShell } from "@/ui/styles";

type ExpenseModalState =
  | null
  | { kind: "create" }
  | { kind: "edit"; expense: ExpenseResponse };

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tripId = id ?? "";
  const { user } = useAuth();
  const { data: trip, isLoading, error } = useTripDetail(tripId);
  const expensesQuery = useExpenses(tripId);
  useExpenseStream(tripId);

  const [expenseModal, setExpenseModal] = useState<ExpenseModalState>(null);
  const [leaving, setLeaving] = useState(false);

  const onLeave = async () => {
    if (!tripId || !window.confirm("Leave this trip?")) {
      return;
    }
    setLeaving(true);
    try {
      await leaveTrip(tripId);
      window.location.href = "/";
    } finally {
      setLeaving(false);
    }
  };

  return (
    <PageShell className="px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              to="/"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              ← All trips
            </Link>
            {isLoading ? (
              <Loading label="Loading trip…" />
            ) : error ? (
              <p className="text-red-400">
                {error instanceof Error ? error.message : "Trip not found"}
              </p>
            ) : trip ? (
              <>
                <h1 className="mt-2 text-2xl font-bold text-slate-50">
                  {trip.name}
                </h1>
                {trip.description ? (
                  <p className="mt-1 text-slate-400">{trip.description}</p>
                ) : null}
                <p className="mt-2 text-xs text-slate-500">
                  Invite:{" "}
                  <span className="font-mono text-slate-300">
                    {trip.invite_code}
                  </span>
                </p>
              </>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/trips/${tripId}/summary`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-600/60 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
            >
              Summary
            </Link>
            <Button
              type="button"
              onClick={() => setExpenseModal({ kind: "create" })}
            >
              Add expense
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={() => void onLeave()}
              disabled={leaving || !tripId}
            >
              {leaving ? "Leaving…" : "Leave trip"}
            </Button>
          </div>
        </div>

        {trip && user ? (
          <ExpenseList
            tripId={tripId}
            expenses={expensesQuery.data ?? []}
            isLoading={expensesQuery.isLoading}
            error={expensesQuery.error}
            members={trip.members}
            currentUserId={user.id}
            onEditExpense={(e) => setExpenseModal({ kind: "edit", expense: e })}
          />
        ) : null}
      </div>

      {trip ? (
        <AddExpenseModal
          open={expenseModal !== null}
          onClose={() => setExpenseModal(null)}
          tripId={tripId}
          members={trip.members}
          mode={expenseModal?.kind === "edit" ? "edit" : "create"}
          expense={
            expenseModal?.kind === "edit" ? expenseModal.expense : undefined
          }
        />
      ) : null}
    </PageShell>
  );
}
