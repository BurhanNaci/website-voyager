"use client";
import React from "react";
import { mockSegments } from "@/lib/mock";

const colorFor = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("risk")) return "#ef4444";     // red
  if (t.includes("price")) return "#f59e0b";    // amber
  if (t.includes("high")) return "#10b981";     // emerald
  if (t.includes("premium")) return "#6366f1";  // indigo
  return "#3b82f6";                              // blue (standard)
};

const fmt = (n: number) => n.toLocaleString("en-US");

export default function SegmentsPage() {
  const totalUsers = mockSegments.reduce((s, x) => s + x.userCount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customer Segments</h1>
          <p className="text-gray-600 mt-2">
            {mockSegments.length} segments • {fmt(totalUsers)} total customers
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Live data
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="text-sm font-medium text-blue-700">Total Segments</div>
          <div className="text-2xl font-bold text-blue-900">{mockSegments.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="text-sm font-medium text-green-700">Total Customers</div>
          <div className="text-2xl font-bold text-green-900">{fmt(totalUsers)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="text-sm font-medium text-purple-700">Largest Segment</div>
          <div className="text-2xl font-bold text-purple-900">{(Math.max(...mockSegments.map(s => s.percentage)) * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="text-sm font-medium text-orange-700">Avg Segment Size</div>
          <div className="text-2xl font-bold text-orange-900">{fmt(Math.round(totalUsers / mockSegments.length))}</div>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockSegments.map((segment) => (
          <SegmentCard key={segment.segmentId} segment={segment} />
        ))}
      </div>
    </div>
  );
}

function SegmentCard({ segment }: { segment: any }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const color = colorFor(segment.title);
  const percentage = (segment.percentage * 100).toFixed(1);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Color accent bar */}
      <div 
        className="h-1 w-full" 
        style={{ backgroundColor: color }}
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{segment.title}</h3>
            <div className="flex items-center gap-2">
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {percentage}%
              </span>
              <span className="text-sm text-gray-500">{fmt(segment.userCount)} customers</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Market Share</div>
            <div className="text-lg font-semibold text-gray-900">{percentage}%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Customers</div>
            <div className="text-lg font-semibold text-gray-900">{fmt(segment.userCount)}</div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Profile</div>
          <p className="text-sm text-gray-600 leading-relaxed">{segment.profile}</p>
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Hide Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Show Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <DetailSection title="Meaning" content={segment.meaning} />
            <DetailSection title="Behavior" content={segment.behavior} />
            <DetailSection title="Strategy" content={segment.strategy} />
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

function DetailSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}


