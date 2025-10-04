"use client";
// app/(whatever)/packages/page.tsx  (veya mevcut sayfanda uygun yere ekle)
import React from "react";

// JSON'u build aşamasında import edebilirsin
// (eğer runtime fetch istiyorsan aşağıda fetch örneği de var)
import payload from "@/data/campaign_stats_payload.json";

// ---- Types (JSON şemasına göre) ----
type SegmentRow = {
  segment: string | null;
  users: number;
  offers: number;
  accepts: number;
  acceptRate: number | null;
};
type CampaignRow = {
  campaign: string | null;
  shown: number;
  accepted: number;
  acceptRate: number | null;
};
type BreakdownRow = {
  campaign: string | null;
  shown: number;
  accepted: number;
  acceptRate: number | null;
};
type Payload = {
  segments: SegmentRow[];
  breakdownBySegment: Record<string, BreakdownRow[]>;
  campaigns: CampaignRow[];
};

// ---- Helpers ----
const fmt = (n: number | null | undefined) =>
  typeof n === "number" ? n.toLocaleString("en-US") : "-";
const pct = (x?: number | null) =>
  typeof x === "number" ? `${(x * 100).toFixed(1)}%` : "-";

const colorForSegment = (title?: string | null) => {
  const t = (title || "").toLowerCase();
  if (t.includes("risk")) return "#ef4444";     // red
  if (t.includes("price")) return "#f59e0b";    // amber
  if (t.includes("high")) return "#10b981";     // emerald
  if (t.includes("premium")) return "#6366f1";  // indigo
  return "#3b82f6";                             // blue (standard/other)
};

const barBg = "#e5e7eb"; // gray-200
const accColor = "#10b981";  // accepted (emerald-500)
const rejColor = "#ef4444";  // rejected (red-500)

// ---- (Opsiyonel) Runtime fetch örneği ----
// async function getPayload(): Promise<Payload> {
//   const r = await fetch("/api/campaign_stats_payload"); // kendi endpoint'in
//   return r.json();
// }

export default function PackagesCampaignsSection() {
  // const [data, setData] = React.useState<Payload | null>(null);
  // React.useEffect(() => { getPayload().then(setData); }, []);
  // const dataToUse = data ?? (payload as Payload);

  const dataToUse = payload as Payload;

  const totalOffers = dataToUse.segments.reduce((s, x) => s + (x.offers || 0), 0);
  const totalAccepted = dataToUse.segments.reduce((s, x) => s + (x.accepts || 0), 0);
  const globalAcceptRate = totalOffers ? totalAccepted / totalOffers : 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Campaigns by Segment</h2>
          <p className="text-sm text-gray-500 mt-1">
            {fmt(totalOffers)} total offers · {fmt(totalAccepted)} accepted ·{" "}
            <span className="font-medium">{pct(globalAcceptRate)}</span> overall accept rate
          </p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 border rounded-xl px-3 py-2">
          Click a segment row to see campaign breakdown.
        </div>
      </div>

      {/* GLOBAL CAMPAIGN SNAPSHOT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-2">
          <div className="text-sm font-medium mb-3">Top campaigns (by shown)</div>
          <div className="space-y-3">
            {dataToUse.campaigns
              .slice()
              .sort((a,b) => (b.shown||0) - (a.shown||0))
              .slice(0, 6)
              .map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="min-w-[160px] text-sm truncate" title={c.campaign ?? "—"}>
                  {c.campaign ?? "—"}
                </div>
                <div className="flex-1">
                  <StackedAcceptBar shown={c.shown} accepted={c.accepted} />
                </div>
                <div className="w-44 flex items-center justify-end gap-3 text-sm tabular-nums">
                  <span className="text-gray-500">{fmt(c.shown)} shown</span>
                  <span className="font-medium">{pct(c.acceptRate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium mb-3">Quick stats</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total offers</span>
              <span className="font-medium tabular-nums">{fmt(totalOffers)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total accepted</span>
              <span className="font-medium tabular-nums">{fmt(totalAccepted)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Overall accept rate</span>
              <span className="font-medium">{pct(globalAcceptRate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEGMENT TABLE */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-sm font-medium mb-3">Segment performance</div>
        <SegmentCampaignTable payload={dataToUse} />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StackedAcceptBar({ shown, accepted }: { shown: number; accepted: number }) {
  const acc = Math.max(0, Math.min(accepted, shown || 0));
  const rej = Math.max(0, (shown || 0) - acc);
  const total = Math.max(1, acc + rej);
  const accW = (acc / total) * 100;
  const rejW = (rej / total) * 100;
  return (
    <div className="h-3 w-full rounded-full" style={{ backgroundColor: barBg }}>
      <div className="h-3 rounded-l-full" style={{ width: `${accW}%`, backgroundColor: accColor }} />
      <div className="h-3 rounded-r-full -mt-3" style={{ width: `${rejW}%`, backgroundColor: rejColor, marginLeft: `${accW}%` }} />
    </div>
  );
}

function SegmentCampaignTable({ payload }: { payload: Payload }) {
  const [openSeg, setOpenSeg] = React.useState<string | null>(null);

  const rows = payload.segments
    .slice()
    .sort((a,b) => (b.offers||0) - (a.offers||0));

  return (
    <div className="divide-y">
      <div className="grid grid-cols-12 text-xs text-gray-500 pb-2">
        <div className="col-span-4">Segment</div>
        <div className="col-span-3 text-right">Offers</div>
        <div className="col-span-3 text-right">Accepted</div>
        <div className="col-span-2 text-right">Accept rate</div>
      </div>
      {rows.map((r, idx) => {
        const segName = r.segment ?? "—";
        const color = colorForSegment(segName);
        const isOpen = openSeg === segName;
        return (
          <div key={idx} className="py-3">
            <button
              onClick={() => setOpenSeg(isOpen ? null : segName)}
              className="w-full grid grid-cols-12 items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-2 text-left transition"
            >
              <div className="col-span-4 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm font-medium">{segName}</span>
              </div>
              <div className="col-span-3 text-sm text-right tabular-nums">{fmt(r.offers)}</div>
              <div className="col-span-3 text-sm text-right tabular-nums">{fmt(r.accepts)}</div>
              <div className="col-span-2 text-sm text-right">{pct(r.acceptRate)}</div>

              {/* Inline bar on the next row */}
              <div className="col-span-12 mt-2">
                <StackedAcceptBar shown={r.offers || 0} accepted={r.accepts || 0} />
              </div>
            </button>

            {isOpen && (
              <div className="mt-3 rounded-xl border bg-gray-50 p-3">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  Campaigns for “{segName}”
                </div>
                <div className="space-y-2">
                  {(payload.breakdownBySegment[segName] || [])
                    .slice()
                    .sort((a,b) => (b.shown||0) - (a.shown||0))
                    .map((c, i) => (
                    <div key={i} className="grid grid-cols-12 items-center gap-2">
                      <div className="col-span-4 text-sm truncate" title={c.campaign ?? "—"}>
                        {c.campaign ?? "—"}
                      </div>
                      <div className="col-span-5">
                        <StackedAcceptBar shown={c.shown || 0} accepted={c.accepted || 0} />
                      </div>
                      <div className="col-span-3 text-sm text-right tabular-nums">
                        {pct(c.acceptRate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
