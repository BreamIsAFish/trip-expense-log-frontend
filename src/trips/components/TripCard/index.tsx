import type { FC } from "react";
import { Link } from "react-router-dom";

import type { TripResponse } from "@/trips/types";

import { TripCardRoot } from "./styles";

export const TripCard: FC<{ trip: TripResponse }> = ({ trip }) => (
  <TripCardRoot className="rounded-xl border border-slate-600/40 bg-slate-900/50 p-4 transition hover:border-cyan-500/40">
    <Link
      to={`/trips/${trip.id}`}
      className="text-lg font-semibold text-cyan-100 hover:text-white"
    >
      {trip.name}
    </Link>
    {trip.description ? (
      <p className="line-clamp-2 text-sm text-slate-400">{trip.description}</p>
    ) : null}
    <p className="text-xs text-slate-500">
      Code:{" "}
      <span className="font-mono text-slate-300">{trip.invite_code}</span>
    </p>
  </TripCardRoot>
);
