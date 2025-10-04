"use client";
import { useState, useEffect } from "react";
import { notificationApi } from "@/lib/api-client";

interface PendingNotification {
  campaign_id: string;
  user_id: number;
  segment: string;
  domain: string;
  cart_items: string[];
  hours_since_abandonment: number;
  sms_preview: string;
  discount_options: Array<{
    discount: number;
    confidence: number;
    strategy: string;
    reasoning: string;
  }>;
  created_at: string;
}

export default function NotificationsPage() {
  const [pendingNotifications, setPendingNotifications] = useState<PendingNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingNotifications();
  }, []);

  const fetchPendingNotifications = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData: PendingNotification[] = [
        {
          campaign_id: "camp_001",
          user_id: 12345,
          segment: "premium_customers",
          domain: "ENUYGUN_HOTEL",
          cart_items: ["Istanbul Hotel - 2 nights", "Breakfast included"],
          hours_since_abandonment: 2,
          sms_preview: "Hi! You left some great deals in your cart. Complete your Istanbul hotel booking with 15% off!",
          discount_options: [
            {
              discount: 15,
              confidence: 0.85,
              strategy: "balanced",
              reasoning: "Premium customer with high conversion probability"
            },
            {
              discount: 20,
              confidence: 0.72,
              strategy: "conversion_maximization",
              reasoning: "Aggressive approach for high-value booking"
            }
          ],
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          campaign_id: "camp_002",
          user_id: 67890,
          segment: "price_sensitive_customers",
          domain: "ENUYGUN_FLIGHT",
          cart_items: ["Istanbul to Paris - Round trip", "Economy class"],
          hours_since_abandonment: 4,
          sms_preview: "Don't miss out! Your Paris flight is waiting. Get 25% off your booking now!",
          discount_options: [
            {
              discount: 25,
              confidence: 0.90,
              strategy: "conversion_maximization",
              reasoning: "Price-sensitive customer needs higher discount"
            },
            {
              discount: 30,
              confidence: 0.78,
              strategy: "aggressive_conversion",
              reasoning: "Maximum discount for guaranteed conversion"
            }
          ],
          created_at: "2024-01-15T08:15:00Z"
        }
      ];
      setPendingNotifications(mockData);
    } catch (error) {
      console.error("Error fetching pending notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (campaignId: string) => {
    try {
      await notificationApi.approveCampaign(campaignId, "manager_1");
      setPendingNotifications(prev => 
        prev.filter(notification => notification.campaign_id !== campaignId)
      );
      alert("Campaign approved successfully!");
    } catch (error) {
      console.error("Error approving campaign:", error);
      alert("Error approving campaign");
    }
  };

  const handleReject = async (campaignId: string, reason?: string) => {
    try {
      await notificationApi.rejectCampaign(campaignId, "manager_1", reason);
      setPendingNotifications(prev => 
        prev.filter(notification => notification.campaign_id !== campaignId)
      );
      alert("Campaign rejected successfully!");
    } catch (error) {
      console.error("Error rejecting campaign:", error);
      alert("Error rejecting campaign");
    }
  };

  const handleSelectDiscount = async (userId: number, discount: number) => {
    try {
      await notificationApi.selectUserOption({
        user_id: userId,
        selected_discount: discount,
        manager_id: "manager_1"
      });
      alert(`Discount ${discount}% selected and sent to user!`);
    } catch (error) {
      console.error("Error selecting discount:", error);
      alert("Error selecting discount");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading pending notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pending Notifications</h1>
          <p className="text-gray-600 mt-2">
            Review and approve cart abandonment campaigns
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <div className="text-sm font-medium text-blue-900">
            {pendingNotifications.length} campaigns pending approval
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {pendingNotifications.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
          <div className="text-gray-500 text-lg">No pending notifications</div>
          <div className="text-gray-400 text-sm mt-2">All campaigns have been reviewed</div>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingNotifications.map((notification) => (
            <div key={notification.campaign_id} className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {notification.segment.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {notification.domain.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      User ID: {notification.user_id}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cart Abandonment Campaign
                  </h3>
                  <p className="text-sm text-gray-600">
                    Abandoned {notification.hours_since_abandonment} hours ago
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Cart Items:</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <ul className="text-sm text-gray-700">
                    {notification.cart_items.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* SMS Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">SMS Preview:</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">{notification.sms_preview}</p>
                </div>
              </div>

              {/* Discount Options */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Discount Options:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {notification.discount_options.map((option, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-green-600">
                          {option.discount}% OFF
                        </span>
                        <span className="text-sm text-gray-500">
                          {(option.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{option.reasoning}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {option.strategy.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleSelectDiscount(notification.user_id, option.discount)}
                          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                        >
                          Select & Send
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <button
                  onClick={() => handleApprove(notification.campaign_id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Approve Campaign
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Rejection reason (optional):");
                    handleReject(notification.campaign_id, reason || undefined);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Reject Campaign
                </button>
                <button
                  onClick={() => setSelectedCampaign(
                    selectedCampaign === notification.campaign_id ? null : notification.campaign_id
                  )}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  {selectedCampaign === notification.campaign_id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {/* Additional Details */}
              {selectedCampaign === notification.campaign_id && (
                <div className="mt-4 pt-4 border-t bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Campaign Details:</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Campaign ID:</span> {notification.campaign_id}
                    </div>
                    <div>
                      <span className="font-medium">User Segment:</span> {notification.segment}
                    </div>
                    <div>
                      <span className="font-medium">Domain:</span> {notification.domain}
                    </div>
                    <div>
                      <span className="font-medium">Hours Since Abandonment:</span> {notification.hours_since_abandonment}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
