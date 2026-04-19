import type { UuidString } from "@/shared/types/common";

export interface TripResponse {
  id: UuidString;
  name: string;
  description: string;
  invite_code: string;
  created_by: UuidString;
  created_at: string;
  updated_at: string;
}

export interface TripMemberBrief {
  user_id: UuidString;
  display_name: string;
  picture_url: string;
  joined_at: string;
}

export interface UnauthorizedUserBrief {
  id: UuidString;
  display_name: string;
}

export interface TripDetailResponse extends TripResponse {
  members: TripMemberBrief[];
}
