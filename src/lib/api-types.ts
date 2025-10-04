// API Types for Manager Portal

// Domain types
export type DomainType =
  | "ENUYGUN_HOTEL"
  | "ENUYGUN_FLIGHT"
  | "ENUYGUN_CAR_RENTAL"
  | "ENUYGUN_BUS"
  | "WINGIE_FLIGHT";

// Segment types
export type SegmentType =
  | "premium_customers"
  | "high_value_customers"
  | "price_sensitive_customers"
  | "at_risk_customers"
  | "standard_customers";

// User scores interface
export interface UserScores {
  churn_score: number;
  activity_score: number;
  cart_abandon_score: number;
  price_sensitivity: number;
  family_score: number;
}

// User interface
export interface User {
  user_id: number;
  domain: DomainType;
  is_oneway: 0 | 1;
  user_basket: 0 | 1;
  segment: SegmentType;
  scores: UserScores;
  previous_domains?: DomainType[];
}

// Discount option interface
export interface DiscountOption {
  discount: number;
  confidence: number;
  strategy: "profit_maximization" | "balanced" | "conversion_maximization" | "aggressive_conversion";
  reasoning: string;
}

// User options response
export interface UserOptionsResponse {
  user_id: number;
  segment: SegmentType;
  domain: DomainType;
  business_rules_applied: string[];
  discount_options: DiscountOption[];
}

// Segment recommendation request
export interface SegmentRecommendationRequest {
  segment_ids?: SegmentType[];
  domain?: DomainType;
  limit?: number;
}

// Segment recommendation response
export interface SegmentRecommendationResponse {
  recommendations: Array<{
    segment: SegmentType;
    domain: DomainType;
    user_count: number;
    recommended_discount: number;
    confidence: number;
    reasoning: string;
  }>;
}

// Batch recommendation request
export interface BatchRecommendationRequest {
  user_ids?: number[];
  segment_ids?: SegmentType[];
  domain?: DomainType;
  limit?: number;
}

// Batch recommendation response
export interface BatchRecommendationResponse {
  recommendations: UserOptionsResponse[];
  total_count: number;
}

// Cart abandonment trigger request
export interface CartAbandonmentTriggerRequest {
  user_id: number;
  cart_items: string[];
  hours: number;
}

// Cart abandonment trigger response
export interface CartAbandonmentTriggerResponse {
  campaign_id: string;
  status: "pending_approval";
}

// Pending approvals response
export interface PendingApprovalsResponse {
  campaigns: Array<{
    campaign_id: string;
    user_id: number;
    segment: SegmentType;
    domain: DomainType;
    cart_items: string[];
    hours_since_abandonment: number;
    sms_preview: string;
    discount_options: DiscountOption[];
    created_at: string;
  }>;
}

// Approval action request
export interface ApprovalActionRequest {
  campaign_id: string;
  manager_id: string;
  action: "approve" | "reject";
  reason?: string;
}

// Select option request
export interface SelectOptionRequest {
  user_id: number;
  selected_discount: number;
  manager_id: string;
}

// Health response
export interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
}

// Stats response
export interface StatsResponse {
  users_cached: number;
  rules_count: number;
  agents_count: number;
  last_updated: string;
}

// API Error interface
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// Notification types
export interface Notification {
  id: string;
  type: "cart_abandonment" | "price_drop" | "reminder";
  title: string;
  message: string;
  user_id: number;
  status: "pending" | "sent" | "failed";
  created_at: string;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  type: "cart_abandonment" | "promotional" | "reminder";
  status: "draft" | "pending_approval" | "approved" | "rejected" | "sent";
  target_segment: SegmentType;
  target_domain: DomainType;
  discount_percentage: number;
  message: string;
  created_at: string;
  approved_at?: string;
  sent_at?: string;
  manager_id?: string;
}

// Manager types
export interface Manager {
  id: string;
  name: string;
  email: string;
  role: "manager" | "admin";
  permissions: string[];
  created_at: string;
}
