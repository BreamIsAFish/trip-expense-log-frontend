import type { UuidString } from "@/shared/types/common";

export interface UserBrief {
  id: UuidString;
  display_name: string;
  picture_url: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserBrief;
}
