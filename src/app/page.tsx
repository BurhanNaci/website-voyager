"use client";
import { useState, useMemo } from "react";
import { mockSegments, mockNotifications } from "@/lib/mock";

// LLM mesajı simülasyonu: segment ve kanal seçimine göre öneri
function getLLMMessage(segmentId: string, channel: "sms" | "push") {
  const seg = mockSegments.find(s => s.segmentId === segmentId);
  if (!seg) return "";
  if (channel === "sms") {
    return `Dear ${seg.title} user, enjoy exclusive discounts tailored for you!`;
  }
  return `Hi ${seg.title}! Special offer: ${seg.strategy}`;
}

export default function Home() {
  const [selectedSegment, setSelectedSegment] = useState<string>(mockSegments[0].segmentId);
  const [selectedChannel, setSelectedChannel] = useState<"sms" | "push">("push");
  const [showCampaignResult, setShowCampaignResult] = useState<boolean>(false);
  const [selectedCampaignType, setSelectedCampaignType] = useState<"A" | "B">("A");

  const totalUsers = mockSegments.reduce((acc, seg) => acc + seg.userCount, 0);

  const campaignTypes = {
    A: {
      title: "Standart Discount Kampanyası",
      pros: ["Geniş kitleye ulaşır", "Düşük maliyet"],
      cons: ["Düşük kişiselleştirme", "Bazı segmentlerde düşük dönüşüm"],
    },
    B: {
      title: "Segment Bazlı Premium Kampanya",
      pros: ["Yüksek kişiselleştirme", "Sadık müşterilerde yüksek dönüşüm"],
      cons: ["Daha yüksek maliyet", "Küçük kitle"],
    },
  };

  // LLM mesajı otomatik oluşturuluyor
  const llmMessage = useMemo(() => getLLMMessage(selectedSegment, selectedChannel), [selectedSegment, selectedChannel]);

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
      {/* Recommendations & Bildirim Gönderme */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="font-semibold text-lg mb-4 text-gray-900">Send Notification to Segment</div>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <select
            className="border rounded-lg px-3 py-2 text-sm font-medium bg-gray-50"
            value={selectedSegment}
            onChange={e => setSelectedSegment(e.target.value)}
          >
            {mockSegments.map(seg => (
              <option key={seg.segmentId} value={seg.segmentId}>{seg.title}</option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2 text-sm font-medium bg-gray-50"
            value={selectedChannel}
            onChange={e => setSelectedChannel(e.target.value as "sms" | "push")}
          >
            <option value="push">Push</option>
            <option value="sms">SMS</option>
          </select>
          <div className="flex-1 flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <span className="text-sm text-blue-900">{llmMessage}</span>
          </div>
          <button
            className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
            onClick={() => setShowCampaignResult(true)}
            disabled={!llmMessage}
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="currentColor"/></svg>
              Send
            </span>
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Select segment and channel to preview the recommended message. You can send it directly to the selected segment.
        </div>
      </div>

      {/* Kampanya sonucu bildirimi */}
      {showCampaignResult && (
        <div className="card p-4 bg-blue-50 border border-blue-200 mt-2 rounded-xl shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-blue-900">Campaign Result</span>
            <button
              className="text-xs text-blue-700"
              onClick={() => setShowCampaignResult(false)}
            >
              Close
            </button>
          </div>
          <div className="mb-2">
            <span className="text-sm">Discount coupon campaign sent to <b>{mockSegments.find(s => s.segmentId === selectedSegment)?.title}</b> via <b>{selectedChannel.toUpperCase()}</b>.</span>
          </div>
          <div className="flex gap-2 mb-2">
            <button
              className={`px-3 py-1 rounded text-xs border ${selectedCampaignType === "A" ? "bg-blue-200" : ""}`}
              onClick={() => setSelectedCampaignType("A")}
            >
              Standart Discount
            </button>
            <button
              className={`px-3 py-1 rounded text-xs border ${selectedCampaignType === "B" ? "bg-blue-200" : ""}`}
              onClick={() => setSelectedCampaignType("B")}
            >
              Premium Segment
            </button>
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">{campaignTypes[selectedCampaignType].title}</div>
            <div className="flex gap-4">
              <div>
                <div className="text-xs font-bold text-green-700 mb-1">Advantages</div>
                <ul className="list-disc ml-4 text-xs text-green-700">
                  {campaignTypes[selectedCampaignType].pros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-bold text-red-700 mb-1">Disadvantages</div>
                <ul className="list-disc ml-4 text-xs text-red-700">
                  {campaignTypes[selectedCampaignType].cons.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
