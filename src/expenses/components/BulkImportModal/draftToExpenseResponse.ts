import type { ExpenseParticipant, ExpenseResponse } from "@/expenses/types";
import type { UnauthorizedUserBrief, TripMemberBrief } from "@/trips/types";

import type { DraftExpense } from "./types";

function participantsToResponse(
  draft: DraftExpense,
  members: TripMemberBrief[],
  unauthorizedUsers: UnauthorizedUserBrief[],
): ExpenseParticipant[] {
  return draft.participants.map((p) => {
    if (p.type === "user") {
      const m = members.find((x) => x.user_id === p.user_id);
      return {
        type: "user" as const,
        user_id: p.user_id,
        display_name: m?.display_name ?? "",
      };
    }
    const u = unauthorizedUsers.find((x) => x.id === p.unauthorized_user_id);
    return {
      type: "unauthorized_user" as const,
      unauthorized_user_id: p.unauthorized_user_id,
      name: u?.display_name ?? "",
    };
  });
}

export function draftToExpenseResponse(
  draft: DraftExpense,
  tripId: string,
  members: TripMemberBrief[],
  unauthorizedUsers: UnauthorizedUserBrief[],
): ExpenseResponse {
  let payer_name = "";
  if (draft.payer_type === "user" && draft.payer_id) {
    payer_name =
      members.find((m) => m.user_id === draft.payer_id)?.display_name ?? "Member";
  } else if (
    draft.payer_type === "unauthorized_user" &&
    draft.payer_unauthorized_user_id
  ) {
    payer_name =
      unauthorizedUsers.find((u) => u.id === draft.payer_unauthorized_user_id)
        ?.display_name ?? "Guest";
  }

  return {
    id: draft._id as ExpenseResponse["id"],
    trip_id: tripId as ExpenseResponse["trip_id"],
    payer_type: draft.payer_type,
    payer_id: draft.payer_id,
    payer_unauthorized_user_id: draft.payer_unauthorized_user_id,
    payer_name,
    name: draft.name,
    description: draft.description,
    amount: draft.amount,
    participants: participantsToResponse(draft, members, unauthorizedUsers),
    created_at: "",
    updated_at: "",
  };
}
