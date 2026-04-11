import type { UuidString } from "@/shared/types/common";

export interface UserBalanceItem {
  user_id: UuidString;
  display_name: string;
  balance: string;
}

export interface PaymentItem {
  from_user_id: UuidString;
  from_display_name: string;
  to_user_id: UuidString;
  to_display_name: string;
  amount: string;
}

export interface SettlementResponse {
  total_amount: string;
  balances: UserBalanceItem[];
  payments: PaymentItem[];
}
