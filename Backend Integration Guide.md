# Voyager Coupon System — Frontend Integration Guide

## Base
- Base URL (local): http://localhost:8080
- Auth: Yok (dev)
- Swagger: http://localhost:8080/docs

## Çalışma Modları (Backend)
- LLM agentleri: ENABLE_LLM_AGENTS=true
- Sağlayıcı: LLM_PROVIDER=openai (veya anthropic)
- API key: OPENAI_API_KEY / ANTHROPIC_API_KEY
- SMS copy LLM: ENABLE_LLM_SMS=true
- Varsayılan hızlı model: OpenAI gpt-4o-mini (veya Anthropıc haiku)

## Önemli Endpoint'ler

### 1) Tek Kullanıcı — Çoklu Seçenek
- POST /recommendations/user
- Body:
```json
{ "user_id": 295 }
```
- 200 Response:
```json
{
  "user_id": 295,
  "segment": "at_risk_customers",
  "domain": "ENUYGUN_FLIGHT",
  "business_rules_applied": ["..."],
  "discount_options": [
    { "discount": 10, "confidence": 0.6, "strategy": "profit_maximization", "reasoning": "..." },
    { "discount": 12, "confidence": 0.8, "strategy": "balanced", "reasoning": "..." },
    { "discount": 13, "confidence": 0.9, "strategy": "conversion_maximization", "reasoning": "..." }
  ]
}
```

### 2) Tek Kullanıcı — Tek Karar (opsiyonel)
- POST /recommend
- Body:
```json
{ "user_id": 295 }
```
- 200 Response (özet karar, agent_votes içerir)

### 3) Segment Stratejisi — Tek Öneri
- POST /recommendations/segment
- Body:
```json
{ "segment": "AT_RISK_CUSTOMERS", "domain": "ENUYGUN_HOTEL", "sample_size": 100 }
```
- 200 Response:
```json
{
  "segment": "AT_RISK_CUSTOMERS",
  "domain": "ENUYGUN_HOTEL",
  "recommended_discount": 12,
  "recommendation_confidence": 0.62,
  "reasoning": "62% of sampled users optimal at 12%",
  "expected_impact": {
    "total_segment_users": 1500,
    "expected_conversion_rate": 0.78,
    "estimated_conversions": 1170,
    "estimated_revenue": 125000,
    "avg_order_value": 2000
  },
  "allowed_discount_range": [10, 12, 13]
}
```

### 4) Batch (segment bazlı toplu çıktı)
- POST /recommendations/batch
- Body (opsiyonel user_ids, boşsa tüm cache):
```json
{ "user_ids": [295, 121, 456] }
```
- 200 Response: Segment kırılımında kullanıcı listesi + kupon dağılımı

### 5) Notification — Trigger → Onaya Düşür → UI Bildirimi
- POST /api/notifications/triggers/cart-abandonment
  - Query veya body: user_id: number, cart_items: string[], hours: number
  - Dönen: { campaign_id, status: "pending_approval" }
- GET /api/notifications/approvals/pending
  - Dönen: pending kampanyalar (sms_preview içerir)
- POST /api/notifications/approvals/{campaign_id}/approve?manager_id=pm_1
- POST /api/notifications/approvals/{campaign_id}/reject?manager_id=pm_1&reason=...
- POST /api/notifications/recommendations/user/{user_id}/select-option?selected_discount=12&manager_id=pm_1
  - PM karar verip anında gönderim simüle eder (UI notification olarak işaretlenir)

### 6) Sağlık / İstatistik
- GET /health
- GET /stats (users_cached, rules, agents)

## TypeScript Tipleri (Frontend)

```ts
// enums
export type DomainType =
  | "ENUYGUN_HOTEL"
  | "ENUYGUN_FLIGHT"
  | "ENUYGUN_CAR_RENTAL"
  | "ENUYGUN_BUS"
  | "WINGIE_FLIGHT";

export type SegmentType =
  | "premium_customers"
  | "high_value_customers"
  | "price_sensitive_customers"
  | "at_risk_customers"
  | "standard_customers";

// user
export interface UserScores {
  churn_score: number;
  activity_score: number;
  cart_abandon_score: number;
  price_sensitivity: number;
  family_score: number;
}

export interface User {
  user_id: number;
  domain: DomainType;
  is_oneway: 0 | 1;
  user_basket: 0 | 1;
  segment: SegmentType;
  scores: UserScores;
  previous_domains?: DomainType[];
}

// multi-option
export interface DiscountOption {
  discount: number;
  confidence: number;
  strategy: "profit_maximization" | "balanced" | "conversion_maximization" | "aggressive_conversion";
  reasoning: string;
}

export interface UserOptionsResponse {
  user_id: number;
  segment: SegmentType;
  domain: DomainType;
  business_rules_applied: string[];
  discount_options: DiscountOption[];
}

// segment recommendation
export interface SegmentRecommendationRequest {
  segment: SegmentType;
  domain?: DomainType;
  sample_size?: number;
}

export interface SegmentRecommendationResponse {
  segment: SegmentType;
  domain: DomainType | "ALL";
  recommended_discount: number;
  recommendation_confidence: number;
  reasoning: string;
  expected_impact: {
    total_segment_users: number;
    expected_conversion_rate: number;
    estimated_conversions: number;
    estimated_revenue: number;
    avg_order_value: number;
  };
  allowed_discount_range: number[];
}

// notifications
export interface PendingCampaignItem {
  campaign_id: string;
  trigger_type: string;
  segment?: SegmentType;
  user_count: number;
  discount: number;
  sms_preview: string;
  created_at: string;
}

export interface PendingApprovalsResponse {
  total_pending: number;
  campaigns: PendingCampaignItem[];
}
```

## API Client Örnekleri (Axios)

```ts
import axios from "axios";
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080" });

// single user multi-option
export async function fetchUserOptions(userId: number) {
  const { data } = await api.post<UserOptionsResponse>("/recommendations/user", { user_id: userId });
  return data;
}

// segment recommendation
export async function fetchSegmentRec(req: SegmentRecommendationRequest) {
  const { data } = await api.post<SegmentRecommendationResponse>("/recommendations/segment", req);
  return data;
}

// pending approvals
export async function fetchPendingApprovals() {
  const { data } = await api.get<PendingApprovalsResponse>("/api/notifications/approvals/pending");
  return data;
}

// approve
export async function approveCampaign(campaignId: string, managerId: string) {
  const { data } = await api.post(`/api/notifications/approvals/${campaignId}/approve`, null, {
    params: { manager_id: managerId },
  });
  return data;
}
```

## UI Akış Önerileri

- "User Detail" sayfası:
  - "Get Options" butonu → /recommendations/user → seçenek kartları (discount, confidence, reasoning)
  - "Send SMS" aksiyonu → select-option endpoint'i veya trigger ile kampanya oluşturma

- "Segment Strategy" sayfası:
  - Form: segment + domain (opsiyonel) → /recommendations/segment
  - Gelen "recommended_discount" ve "expected_impact" gösterimi
  - "Create Segment Campaign" → /api/notifications/triggers/segment-campaign

- "Approvals" (PM Dashboard):
  - /api/notifications/approvals/pending listesi
  - "Approve / Reject" aksiyonları

## CORS
- Eğer frontend farklı origin'den çağırıyorsa, dev'de proxy veya backend'de CORS açın (FastAPI CORSMiddleware).

## Hız İpuçları
- Tek kullanıcı akışı: LLM açıkken dahi 1–2 çağrı var; prompt'u kısa tutun.
- Segment akışı: sample_size ile oynayın (varsayılan 100).

## Hata Kodları
- 400: Body/param eksik
- 404: User/campaign bulunamadı
- 503: Backend init edilmedi (startup beklenmeli)

Bu dokümanı frontend klasörüne ekleyip env'de `NEXT_PUBLIC_API_URL=http://localhost:8080` ayarıyla direkt bağlayabilirsiniz.
