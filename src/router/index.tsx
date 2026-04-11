import { Route, Routes } from "react-router-dom";

import { TripListPage } from "@/trips/pages/TripListPage";
import { TripDetailPage } from "@/trips/pages/TripDetailPage";
import { SettlementPage } from "@/settlement/pages/SettlementPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<TripListPage />} />
      <Route path="/trips/:id" element={<TripDetailPage />} />
      <Route path="/trips/:id/summary" element={<SettlementPage />} />
    </Routes>
  );
}
