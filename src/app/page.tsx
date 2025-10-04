"use client";
import { useState } from "react";
import { mockSegments } from "@/lib/mock";
import { notificationApi } from "@/lib/api-client";

export default function Home() {
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastTriggerResult, setLastTriggerResult] = useState<string | null>(null);

  const totalUsers = mockSegments.reduce((acc, seg) => acc + seg.userCount, 0);

  const triggerCartAbandonment = async (userId: number, cartItems: string[], hours: number) => {
    try {
      setIsTriggering(true);
      const result = await notificationApi.triggerCartAbandonment({
        user_id: userId,
        cart_items: cartItems,
        hours: hours
      });
      
      setLastTriggerResult(`Campaign ${result.campaign_id} created and sent for manager approval!`);
      
      // Clear the result after 5 seconds
      setTimeout(() => setLastTriggerResult(null), 5000);
    } catch (error) {
      console.error("Error triggering cart abandonment:", error);
      setLastTriggerResult("Error triggering cart abandonment notification");
      setTimeout(() => setLastTriggerResult(null), 5000);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Segment ve kullanıcı özetleri */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col items-center justify-center">
          <div className="text-xs text-gray-500 mb-1">Total Users</div>
          <div className="text-2xl font-bold text-[var(--brand)]">{totalUsers.toLocaleString()}</div>
        </div>
        {mockSegments.map(seg => (
          <div key={seg.segmentId} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 mb-1">{seg.title}</div>
            <div className="text-lg font-bold text-gray-900">{seg.userCount.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">{(seg.percentage * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
      {/* Sepet Abandonment Simülasyonu */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="font-semibold text-lg mb-4 text-gray-900">Cart Abandonment Simulation</div>
        <div className="text-sm text-gray-600 mb-4">
          Test the cart abandonment notification system by simulating user actions:
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            onClick={() => triggerCartAbandonment(
              12345, 
              ["Istanbul Hotel - 2 nights", "Breakfast included"], 
              2
            )}
            disabled={isTriggering}
          >
            {isTriggering ? "Triggering..." : "Simulate Cart Abandonment"}
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={() => triggerCartAbandonment(
              67890, 
              ["Istanbul to Paris - Round trip", "Economy class"], 
              4
            )}
            disabled={isTriggering}
          >
            {isTriggering ? "Triggering..." : "Simulate Multiple Abandonments"}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-3">
          These actions will trigger cart abandonment notifications that require manager approval.
        </div>
        
        {/* Trigger Result */}
        {lastTriggerResult && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800">{lastTriggerResult}</div>
            <div className="text-xs text-green-600 mt-1">
              Check the Notifications page to review and approve the campaign.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
