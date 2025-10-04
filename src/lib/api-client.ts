import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  UserOptionsResponse,
  SegmentRecommendationRequest,
  SegmentRecommendationResponse,
  BatchRecommendationRequest,
  BatchRecommendationResponse,
  PendingApprovalsResponse,
  CartAbandonmentTriggerRequest,
  CartAbandonmentTriggerResponse,
  ApprovalActionRequest,
  SelectOptionRequest,
  HealthResponse,
  StatsResponse,
  ApiError,
} from "./api-types";


// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  
  const api = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor for logging
  api.interceptors.request.use(
    (config) => {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error("[API] Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      console.error("[API] Response error:", error.response?.data || error.message);
      
      // Transform error to our ApiError format
      const apiError: ApiError = {
        detail: error.response?.data?.detail || error.message || "Unknown error",
        status_code: error.response?.status || 500,
      };
      
      return Promise.reject(apiError);
    }
  );

  return api;
};

const api = createApiClient();

// Recommendation API functions
export const recommendationApi = {
  // Single user - multiple options
  async fetchUserOptions(userId: number): Promise<UserOptionsResponse> {
    const { data } = await api.post<UserOptionsResponse>("/recommendations/user", {
      user_id: userId,
    });
    return data;
  },

  // Single user - single decision (optional)
  async fetchUserRecommendation(userId: number): Promise<any> {
    const { data } = await api.post("/recommend", { user_id: userId });
    return data;
  },

  // Segment strategy - single recommendation
  async fetchSegmentRecommendation(
    request: SegmentRecommendationRequest
  ): Promise<SegmentRecommendationResponse> {
    const { data } = await api.post<SegmentRecommendationResponse>(
      "/recommendations/segment",
      request
    );
    return data;
  },

  // Batch recommendations
  async fetchBatchRecommendations(
    request: BatchRecommendationRequest = {}
  ): Promise<BatchRecommendationResponse> {
    const { data } = await api.post<BatchRecommendationResponse>(
      "/recommendations/batch",
      request
    );
    return data;
  },
};

// Notification API functions
export const notificationApi = {
  // Trigger cart abandonment notification
  async triggerCartAbandonment(
    request: CartAbandonmentTriggerRequest
  ): Promise<CartAbandonmentTriggerResponse> {
    const { data } = await api.post<CartAbandonmentTriggerResponse>(
      "/api/notifications/triggers/cart-abandonment",
      request
    );
    return data;
  },

  // Get pending approvals
  async fetchPendingApprovals(): Promise<PendingApprovalsResponse> {
    const { data } = await api.get<PendingApprovalsResponse>(
      "/api/notifications/approvals/pending"
    );
    return data;
  },

  // Approve campaign
  async approveCampaign(campaignId: string, managerId: string): Promise<void> {
    await api.post(`/api/notifications/approvals/${campaignId}/approve`, null, {
      params: { manager_id: managerId },
    });
  },

  // Reject campaign
  async rejectCampaign(
    campaignId: string,
    managerId: string,
    reason?: string
  ): Promise<void> {
    await api.post(`/api/notifications/approvals/${campaignId}/reject`, null, {
      params: { manager_id: managerId, reason },
    });
  },

  // Select discount option for user
  async selectUserOption(request: SelectOptionRequest): Promise<void> {
    const { user_id, selected_discount, manager_id } = request;
    await api.post(
      `/api/notifications/recommendations/user/${user_id}/select-option`,
      null,
      {
        params: { selected_discount, manager_id },
      }
    );
  },
};

// System API functions
export const systemApi = {
  // Health check
  async checkHealth(): Promise<HealthResponse> {
    const { data } = await api.get<HealthResponse>("/health");
    return data;
  },

  // Get statistics
  async getStats(): Promise<StatsResponse> {
    const { data } = await api.get<StatsResponse>("/stats");
    return data;
  },
};

// Export the main API client instance for custom requests
export { api };

// Export all API functions as a single object for convenience
export const voyagerApi = {
  recommendations: recommendationApi,
  notifications: notificationApi,
  system: systemApi,
};

// Export types for use in components
export * from "./api-types";
