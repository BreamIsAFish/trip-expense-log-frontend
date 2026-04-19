import type { FC } from "react";
import { Link } from "react-router-dom";

import type { TripResponse } from "@/trips/types";

import { TripCardRoot } from "./styles";

export const TripCard: FC<{ trip: TripResponse }> = ({ trip }) => (
  <TripCardRoot className="rounded-xl border border-violet-200/80 bg-white p-4 shadow-sm transition hover:border-brand-400/60 hover:shadow-md">
    <Link
      to={`/trips/${trip.id}`}
      className="text-lg font-semibold text-brand-700 hover:text-brand-600"
    >
      {trip.name}
    </Link>
    {trip.description ? (
      <p className="line-clamp-2 text-sm text-stone-500">{trip.description}</p>
    ) : null}
    <p className="text-xs text-stone-500">
      Code:{" "}
      <span className="font-mono text-stone-700">{trip.invite_code}</span>
    </p>
  </TripCardRoot>
);
