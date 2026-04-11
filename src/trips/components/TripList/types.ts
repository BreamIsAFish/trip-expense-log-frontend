import type { TripResponse } from "@/trips/types";

export interface TripListProps {
  trips: TripResponse[];
  onCreate: () => void;
  onJoin: () => void;
}
