"use client";

import React, { useMemo, useState } from "react";

const hourlyData = [
  { hour: 9, users: 13103, label: "09:00" },
  { hour: 10, users: 21462, label: "10:00" },
  { hour: 11, users: 28165, label: "11:00" },
  { hour: 12, users: 33199, label: "12:00" },
  { hour: 13, users: 35177, label: "13:00" },
  { hour: 14, users: 38040, label: "14:00" },
  { hour: 15, users: 33046, label: "15:00" },
  { hour: 16, users: 33924, label: "16:00" },
  { hour: 17, users: 31273, label: "17:00" },
  { hour: 18, users: 30210, label: "18:00" },
  { hour: 19, users: 29401, label: "19:00" },
  { hour: 20, users: 32046, label: "20:00" },
  { hour: 21, users: 34240, label: "21:00" },
  { hour: 22, users: 34150, label: "22:00" },
  { hour: 23, users: 31628, label: "23:00" },
  { hour: 0, users: 25224, label: "00:00" },
  { hour: 1, users: 15889, label: "01:00" },
];

const CHART_HEIGHT = 280; // px – bar alanının sabit yüksekliği
const MIN_BAR = 4;        // çok küçük değerler için minimum bar yüksekliği

interface Props {
  selectedHour?: number;
  onHourSelect?: (hour: number) => void;
}

export default function HourlyDemandChart({ selectedHour, onHourSelect }: Props) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const maxUsers = useMemo(
    () => Math.max(...hourlyData.map((d) => d.users)),
    []
  );

  const peakHour = useMemo(
    () => hourlyData.reduce((max, d) => (d.users > max.users ? d : max), hourlyData[0]),
    []
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Platform Usage by Hour</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Live data
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Click any bar to select the optimal time for your campaign
        </p>
      </div>

      {/* Chart area */}
      <div className="relative">
        {/* Y-axis guide labels */}
        <div className="absolute left-0 top-4 bottom-8 flex flex-col justify-between text-xs text-gray-500 z-10">
          <span>{maxUsers.toLocaleString()}</span>
          <span>{Math.round(maxUsers * 0.75).toLocaleString()}</span>
          <span>{Math.round(maxUsers * 0.5).toLocaleString()}</span>
          <span>{Math.round(maxUsers * 0.25).toLocaleString()}</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div
          className="ml-10 bg-gray-50 rounded-lg px-4 py-4 overflow-visible"
          style={{ height: CHART_HEIGHT + 64 }} // bar alanı + alt etiket payı
        >
          <div className="h-[280px] flex items-end justify-between overflow-visible">
            {hourlyData.map((d) => {
              const hPx = Math.max(
                MIN_BAR,
                Math.round((d.users / maxUsers) * CHART_HEIGHT)
              );
              const isSelected = selectedHour === d.hour;
              const isHovered = hoveredHour === d.hour;
              const isPeak = d.hour === peakHour.hour;

              return (
                <div
                  key={d.hour}
                  className="flex flex-col items-center cursor-pointer select-none"
                  onClick={() => onHourSelect?.(d.hour)}
                  onMouseEnter={() => setHoveredHour(d.hour)}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  <div className="relative w-8">
                    <div
                      className={[
                        "w-full rounded-t transition-all duration-200",
                        isSelected
                          ? "bg-gradient-to-t from-blue-600 to-blue-500 shadow-lg"
                          : isPeak
                          ? "bg-gradient-to-t from-green-600 to-green-500 shadow-md"
                          : isHovered
                          ? "bg-gradient-to-t from-blue-500 to-blue-400 shadow-md"
                          : "bg-gradient-to-t from-gray-400 to-gray-300 hover:from-gray-500 hover:to-gray-400",
                      ].join(" ")}
                      style={{ height: hPx }}
                    />

                    {/* Tooltip */}
                    {(isHovered || isSelected) && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
                        {d.label}: {d.users.toLocaleString()} users
                        {isPeak && <div className="text-yellow-300">PEAK HOUR</div>}
                      </div>
                    )}
                  </div>

                  {/* x-axis label */}
                  <div
                    className={[
                      "mt-2 text-xs font-medium",
                      isSelected ? "text-blue-600" : isPeak ? "text-green-600" : "text-gray-600",
                    ].join(" ")}
                    aria-hidden
                  >
                    {d.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected summary */}
      {selectedHour !== undefined && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-900">Selected Campaign Time</div>
              <div className="text-lg font-semibold text-blue-900">
                {hourlyData.find((x) => x.hour === selectedHour)?.label}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700">Active Users</div>
              <div className="text-lg font-semibold text-blue-900">
                {hourlyData.find((x) => x.hour === selectedHour)?.users.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Peak summary */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-900 mb-1">Peak Hour</div>
          <div className="text-lg font-semibold text-green-900">{peakHour.label}</div>
          <div className="text-xs text-green-700">
            {peakHour.users.toLocaleString()} users
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">High Activity</div>
          <div className="text-lg font-semibold text-blue-900">
            {hourlyData.filter((d) => d.users >= 32000).length} hours
          </div>
          <div className="text-xs text-blue-700">30k+ users</div>
        </div>
      </div>
    </div>
  );
}
