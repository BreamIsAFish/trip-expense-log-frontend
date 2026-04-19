import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "@/auth/hooks/useAuth";
import { useTripDetail } from "@/trips/hooks/useTripDetail";
import { leaveTrip } from "@/trips/services/tripService";
import { useUnauthorizedUsers } from "@/trips/hooks/useUnauthorizedUsers";
import { UnauthorizedUsersPanel } from "@/trips/components/UnauthorizedUsersPanel";
import { toBrief } from "@/trips/services/unauthorizedUserService";
import { BulkImportModal } from "@/expenses/components/BulkImportModal";
import type { DraftExpense } from "@/expenses/components/BulkImportModal/types";
import { ExpenseList } from "@/expenses/components/ExpenseList";
import { AddExpenseModal } from "@/expenses/components/AddExpenseModal";
import { useExpenses } from "@/expenses/hooks/useExpenses";
import { useExpenseStream } from "@/expenses/hooks/useExpenseStream";
import type { ExpenseResponse } from "@/expenses/types";
import { parseExpenseCsv } from "@/expenses/utils/csvParser";
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
  const unauthorizedUsersQuery = useUnauthorizedUsers(tripId);
  const expensesQuery = useExpenses(tripId);
  useExpenseStream(tripId);

  const [expenseModal, setExpenseModal] = useState<ExpenseModalState>(null);
  const [bulkDrafts, setBulkDrafts] = useState<DraftExpense[] | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [tripMenuOpen, setTripMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const unauthorizedUsers =
    unauthorizedUsersQuery.data?.unauthorized_users.map(toBrief) ?? [];

  useEffect(() => {
    if (!tripMenuOpen) {
      return;
    }
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setTripMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTripMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [tripMenuOpen]);

  const onCsvFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file || !trip) {
      return;
    }
    void (async () => {
      try {
        const text = await file.text();
        const drafts = parseExpenseCsv(text, trip.members, unauthorizedUsers);
        setBulkDrafts(drafts);
      } catch (err) {
        window.alert(
          err instanceof Error ? err.message : "Could not read CSV file",
        );
      }
    })();
  };

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
    <PageShell className="px-4 py-8 pb-28">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              to="/"
              className="text-sm text-brand-700 hover:text-brand-600"
            >
              ← All trips
            </Link>
            {isLoading ? (
              <Loading label="Loading trip…" />
            ) : error ? (
              <p className="text-rose-600">
                {error instanceof Error ? error.message : "Trip not found"}
              </p>
            ) : trip ? (
              <>
                <h1 className="mt-2 text-2xl font-bold text-stone-800">
                  {trip.name}
                </h1>
                {trip.description ? (
                  <p className="mt-1 text-stone-500">{trip.description}</p>
                ) : null}
                <p className="mt-2 text-xs text-stone-500">
                  Invite:{" "}
                  <span className="font-mono text-stone-700">
                    {trip.invite_code}
                  </span>
                </p>
              </>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/trips/${tripId}/summary`}
              className="inline-flex items-center justify-center rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-violet-50"
            >
              Summary
            </Link>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-violet-200 bg-white text-lg leading-none text-stone-500 shadow-sm hover:bg-violet-50 hover:text-stone-700"
                aria-expanded={tripMenuOpen}
                aria-haspopup="menu"
                aria-label="Trip options"
                onClick={() => setTripMenuOpen((o) => !o)}
              >
                ⋮
              </button>
              {tripMenuOpen ? (
                <div
                  className="absolute right-0 top-full z-30 mt-1 min-w-44 rounded-lg border border-violet-200 bg-white py-1 shadow-lg"
                  role="menu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    disabled={leaving || !tripId}
                    onClick={() => {
                      setTripMenuOpen(false);
                      void onLeave();
                    }}
                  >
                    {leaving ? "Leaving…" : "Leave trip"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {tripId ? <UnauthorizedUsersPanel tripId={tripId} /> : null}

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
        <>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            aria-hidden
            onChange={onCsvFileChange}
          />
          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-lg shadow-violet-900/10 ring-4 ring-white/90 transition hover:bg-violet-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-400/50"
              aria-label="Import expenses from CSV"
              onClick={() => csvInputRef.current?.click()}
            >
              Import CSV
            </button>
            <button
              type="button"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-3xl font-light leading-none text-white shadow-lg shadow-brand-700/30 ring-4 ring-white/90 transition hover:bg-brand-500 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-400/50"
              aria-label="Add expense"
              onClick={() => setExpenseModal({ kind: "create" })}
            >
              +
            </button>
          </div>
          <BulkImportModal
            open={bulkDrafts !== null}
            onClose={() => setBulkDrafts(null)}
            tripId={tripId}
            members={trip.members}
            unauthorizedUsers={unauthorizedUsers}
            initialDrafts={bulkDrafts ?? []}
          />
          <AddExpenseModal
            open={expenseModal !== null}
            onClose={() => setExpenseModal(null)}
            tripId={tripId}
            members={trip.members}
            unauthorizedUsers={unauthorizedUsers}
            mode={expenseModal?.kind === "edit" ? "edit" : "create"}
            expense={
              expenseModal?.kind === "edit" ? expenseModal.expense : undefined
            }
          />
        </>
      ) : null}
    </PageShell>
  );
}
