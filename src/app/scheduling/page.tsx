"use client";
import { useState } from "react";
import HourlyDemandChart from "@/components/HourlyDemandChart";

export default function SchedulingPage() {
  const [selectedHour, setSelectedHour] = useState<number | undefined>(14); // Default to peak hour

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
  };

  const getRecommendationForHour = (hour: number) => {
    const recommendations = {
      9: "Morning start - users beginning their day (13,103 users)",
      10: "Rising activity - users planning their day (21,462 users)",
      11: "Strong engagement - mid-morning peak (28,165 users)",
      12: "Lunch break activity - high engagement (33,199 users)",
      13: "Afternoon peak - excellent engagement (35,177 users)",
      14: "PEAK HOUR - Maximum user activity (38,040 users)",
      15: "Post-peak afternoon - still very high (33,046 users)",
      16: "Late afternoon - good engagement (33,924 users)",
      17: "End of workday - users planning evening (31,273 users)",
      18: "Evening planning - dinner/leisure time (30,210 users)",
      19: "Prime evening - high engagement (29,401 users)",
      20: "Peak evening - maximum leisure time (32,046 users)",
      21: "Late evening peak - high engagement (34,240 users)",
      22: "Night activity - engaged users (34,150 users)",
      23: "Late night - dedicated users (31,628 users)",
      0: "Midnight activity - night owls (25,224 users)",
      1: "Late night - low but engaged audience (15,889 users)"
    };
    return recommendations[hour as keyof typeof recommendations] || "Standard engagement";
  };

  const getConfidenceForHour = (hour: number) => {
    // Higher confidence for peak hours
    if (hour >= 12 && hour <= 22) return 0.9;
    if (hour >= 9 && hour <= 11) return 0.7;
    if (hour >= 23 || hour <= 1) return 0.6;
    return 0.5;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaign Scheduling</h1>
          <p className="text-gray-600 mt-2">
            Interactive hour selection based on user activity patterns
          </p>
        </div>
      </div>

      {/* Main Chart */}
      <HourlyDemandChart 
        selectedHour={selectedHour} 
        onHourSelect={handleHourSelect} 
      />

      {/* Recommendations */}
      {selectedHour !== undefined && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recommendation Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Recommendation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">Optimal Timing</div>
                <div className="text-lg font-semibold text-blue-900">
                  {selectedHour.toString().padStart(2, '0')}:00
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  {getRecommendationForHour(selectedHour)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Confidence</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {(getConfidenceForHour(selectedHour) * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">User Count</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedHour === 9 ? '13,103' : 
                     selectedHour === 10 ? '21,462' :
                     selectedHour === 11 ? '28,165' :
                     selectedHour === 12 ? '33,199' :
                     selectedHour === 13 ? '35,177' :
                     selectedHour === 14 ? '38,040' :
                     selectedHour === 15 ? '33,046' :
                     selectedHour === 16 ? '33,924' :
                     selectedHour === 17 ? '31,273' :
                     selectedHour === 18 ? '30,210' :
                     selectedHour === 19 ? '29,401' :
                     selectedHour === 20 ? '32,046' :
                     selectedHour === 21 ? '34,240' :
                     selectedHour === 22 ? '34,150' :
                     selectedHour === 23 ? '31,628' :
                     selectedHour === 0 ? '25,224' :
                     selectedHour === 1 ? '15,889' : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Campaign</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900 mb-2">Ready to Send</div>
                <div className="text-sm text-green-700">
                  Campaign will be scheduled for {selectedHour.toString().padStart(2, '0')}:00 UTC
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-[var(--brand)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--brand-dark)] transition-colors">
                  Schedule Campaign
                </button>
              </div>
              
              <div className="text-xs text-gray-500">
                Campaign will be sent to selected segments at the chosen time
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Peak Hours Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm font-medium text-red-900 mb-1">Highest Peak</div>
            <div className="text-lg font-semibold text-red-900">14:00 (38,040 users)</div>
            <div className="text-xs text-red-700">Best for maximum reach</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm font-medium text-yellow-900 mb-1">Evening Peak</div>
            <div className="text-lg font-semibold text-yellow-900">21:00 (34,240 users)</div>
            <div className="text-xs text-yellow-700">Good for leisure campaigns</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-1">Morning Rise</div>
            <div className="text-lg font-semibold text-blue-900">11:00 (28,165 users)</div>
            <div className="text-xs text-blue-700">Good for planning campaigns</div>
          </div>
        </div>
      </div>
    </div>
  );
}


