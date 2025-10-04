import React from "react";
import { mockSegments } from "@/lib/mock";

// --- helpers ---
const fmt = (n: number) => n.toLocaleString("en-US");
const totalUsers = mockSegments.reduce((s, x) => s + x.userCount, 0);

const colorFor = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("risk")) return "#ef4444";     // red
  if (t.includes("price")) return "#f59e0b";    // amber
  if (t.includes("high")) return "#10b981";     // emerald
  if (t.includes("premium")) return "#6366f1";  // indigo
  return "#3b82f6";                              // blue (standard)
};

const pieData = mockSegments.map((s) => ({
  name: s.title,
  value: s.userCount,
  color: colorFor(s.title),
}));

export default function SegmentsPage() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Segments (v2)</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mockSegments.length} segments · {fmt(totalUsers)} total users
          </p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 border rounded-xl px-3 py-2">
          Cards are compact—click “Show details” to expand.
        </div>
      </div>

      {/* CHART + SNAPSHOT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-2">
          <div className="text-sm font-medium mb-2">User distribution by segment</div>
          <DonutChart data={pieData} />
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium mb-2">Snapshot</div>
          <div className="space-y-3">
            {mockSegments.map((s) => (
              <div key={s.segmentId} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: colorFor(s.title) }}
                  />
                  <span className="text-sm">{s.title}</span>
                </div>
                <div className="text-sm tabular-nums">{fmt(s.userCount)}</div>
              </div>
            ))}
            <div className="border-t my-2" />
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">Total</div>
              <div className="font-medium tabular-nums">{fmt(totalUsers)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEGMENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockSegments.map((s) => (
          <SegmentCard key={s.segmentId} segment={s} />
        ))}
      </div>
    </div>
  );
}

/* -------- Card Component (no external deps) -------- */
function SegmentCard({ segment }: { segment: any }) {
  const [open, setOpen] = React.useState(false);
  const pct = (segment.percentage * 100).toFixed(1);
  const color = colorFor(segment.title);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="text-base font-medium leading-tight">{segment.title}</div>
        <span
          className="rounded-full px-2 py-0.5 text-xs text-white"
          style={{ backgroundColor: color }}
        >
          {pct}%
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500">Users</span>
        <span className="font-medium tabular-nums">{fmt(segment.userCount)}</span>
      </div>

      <div className="mt-2 text-sm">
        <span className="text-gray-500">Summary: </span>
        <span>{segment.profile}</span>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 w-full text-sm border rounded-md py-1.5 hover:bg-gray-50 transition"
      >
        {open ? "Hide details" : "Show details"}
      </button>

      {open && (
        <div className="mt-2 space-y-2 text-sm">
          <DetailRow label="Meaning" value={segment.meaning} />
          <DetailRow label="Behavior" value={segment.behavior} />
          <DetailRow label="Strategy" value={segment.strategy} />
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="leading-relaxed">
      <span className="font-medium">{label}: </span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

/* -------- Donut Chart (pure SVG) -------- */
function DonutChart({
  data,
  size = 320,
  inner = 70,
  outer = 110,
}: {
  data: { name: string; value: number; color: string }[];
  size?: number;
  inner?: number;
  outer?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = -90; // start top
  const cx = size / 2;
  const cy = size / 2;

  const segs = data.map((d) => {
    const a0 = angle;
    const a1 = angle + (d.value / total) * 360;
    angle = a1;
    return { ...d, a0, a1 };
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <svg width={size} height={size} className="mx-auto">
          <g>
            {segs.map((s, i) => (
              <path
                key={i}
                d={ringSectorPath(cx, cy, inner, outer, s.a0, s.a1)}
                fill={s.color}
              >
                <title>
                  {s.name}: {((s.value / total) * 100).toFixed(1)}% ({fmt(s.value)})
                </title>
              </path>
            ))}
            <circle cx={cx} cy={cy} r={inner - 8} fill="#fff" />
            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-gray-700" style={{ fontSize: 12 }}>
              Total
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>
              {fmt(total)}
            </text>
          </g>
        </svg>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="truncate text-sm" title={d.name}>{d.name}</span>
              </div>
              <span className="text-sm tabular-nums">
                {((d.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, a: number) {
  const rad = (a * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function ringSectorPath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number
) {
  const p0 = polar(cx, cy, r1, a0);
  const p1 = polar(cx, cy, r1, a1);
  const p2 = polar(cx, cy, r0, a1);
  const p3 = polar(cx, cy, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${r0} ${r0} 0 ${large} 0 ${p3.x} ${p3.y}`,
    "Z",
  ].join(" ");
}
