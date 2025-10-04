export type SegmentId =
  | "AT_RISK_CUSTOMERS"
  | "HIGH_VALUE_CUSTOMERS"
  | "STANDARD_CUSTOMERS"
  | "PRICE_SENSITIVE_CUSTOMERS"
  | "PREMIUM_CUSTOMERS";

export interface UserProfile {
  id: string;
  email: string;
  registered: boolean;
  primaryDomain: string | null;
  missingDomains: string[];
  segmentId: SegmentId;
  personalityType: string;
  score: number;
  isOneTimeTrip: boolean;
  frequentActiveHourUtc: number; // 0-23
}

export interface NotificationOption {
  id: string;
  title: string;
  body: string;
  targetSegmentIds: SegmentId[];
  suggestedChannels: ("push" | "email" | "sms")[];
  recommendedSendHoursUtc: number[];
  xaiPros: string[];
  xaiCons: string[];
}

export interface SegmentOverview {
  segmentId: SegmentId;
  title: string; // Human readable
  userCount: number;
  percentage: number; // 0..1
  profile: string;
  meaning: string;
  behavior: string;
  strategy: string;
}

export interface SchedulingSuggestion {
  hourUtc: number;
  rationale: string;
  confidence: number; // 0..1
}


