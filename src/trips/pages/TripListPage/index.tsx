import { useState } from "react";

import { useAuth } from "@/auth/hooks/useAuth";
import { useTrips } from "@/trips/hooks/useTrips";
import { CreateTripModal } from "@/trips/components/CreateTripModal";
import { JoinTripModal } from "@/trips/components/JoinTripModal";
import { TripList } from "@/trips/components/TripList";
import { PageShell } from "@/ui/styles";
import { Button } from "@/ui/components/Button";
import { Loading } from "@/ui/components/Loading";

export function TripListPage() {
  const { data, isLoading, error } = useTrips();
  const { user, logout } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <PageShell className="px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="font-medium text-slate-100">
              {user?.display_name ?? "—"}
            </p>
          </div>
          <Button variant="ghost" type="button" onClick={logout}>
            Sign out
          </Button>
        </header>

        {isLoading ? (
          <Loading label="Loading trips…" />
        ) : error ? (
          <p className="text-red-400">
            {error instanceof Error ? error.message : "Failed to load trips"}
          </p>
        ) : (
          <TripList
            trips={data ?? []}
            onCreate={() => setCreateOpen(true)}
            onJoin={() => setJoinOpen(true)}
          />
        )}
      </div>

      <CreateTripModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <JoinTripModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </PageShell>
  );
}
