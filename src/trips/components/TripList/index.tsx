import type { FC } from "react";

import { Button } from "@/ui/components/Button";

import { TripCard } from "@/trips/components/TripCard";

import type { TripListProps } from "./types";
import { TripGrid } from "./styles";

export const TripList: FC<TripListProps> = ({ trips, onCreate, onJoin }) => (
  <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-slate-50">Your trips</h1>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" type="button" onClick={onJoin}>
          Join trip
        </Button>
        <Button type="button" onClick={onCreate}>
          Create trip
        </Button>
      </div>
    </div>
    {trips.length === 0 ? (
      <p className="rounded-lg border border-dashed border-slate-600/60 bg-slate-900/40 p-8 text-center text-slate-400">
        No trips yet. Create one or join with an invite code.
      </p>
    ) : (
      <TripGrid>
        {trips.map((t) => (
          <TripCard key={t.id} trip={t} />
        ))}
      </TripGrid>
    )}
  </div>
);
