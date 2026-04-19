import type { UuidString } from "@/shared/types/common";

export type PartyKind = "user" | "unauthorized_user";

export interface BalanceEntry {
  kind: PartyKind;
  user_id?: UuidString;
  unauthorized_user_id?: UuidString;
  display_name: string;
  balance: string;
}

export interface PaymentItem {
  from_kind: PartyKind;
  from_user_id?: UuidString;
  from_unauthorized_user_id?: UuidString;
  from_display_name: string;
  to_kind: PartyKind;
  to_user_id?: UuidString;
  to_unauthorized_user_id?: UuidString;
  to_display_name: string;
  amount: string;
}

export interface SettlementResponse {
  total_amount: string;
  balances: BalanceEntry[];
  payments: PaymentItem[];
}
