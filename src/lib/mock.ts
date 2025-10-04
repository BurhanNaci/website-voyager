import { SegmentOverview, NotificationOption, SchedulingSuggestion, UserProfile } from "./types";

export const mockUsers: UserProfile[] = [
  {
    id: "u1",
    email: "alice@example.com",
    registered: true,
    primaryDomain: "flight",
    missingDomains: ["hotel"],
    segmentId: "HIGH_VALUE_CUSTOMERS",
    personalityType: "Explorer",
    score: 0.82,
    isOneTimeTrip: false,
    frequentActiveHourUtc: 9,
  },
  {
    id: "u2",
    email: "bob@example.com",
    registered: false,
    primaryDomain: "bus",
    missingDomains: ["flight", "hotel"],
    segmentId: "AT_RISK_CUSTOMERS",
    personalityType: "Planner",
    score: 0.64,
    isOneTimeTrip: true,
    frequentActiveHourUtc: 19,
  },
];

export const mockSegments: SegmentOverview[] = [
  {
    segmentId: "AT_RISK_CUSTOMERS",
    title: "At-Risk Customers",
    userCount: 97686,
    percentage: 0.264,
    profile: "Low value, high churn risk, price sensitive, low activity",
    meaning: "Low spenders likely to leave, highly price-conscious",
    behavior: "Infrequent bookings, cart abandonment, strong discount response",
    strategy: "Urgent retention: offer 10-13% discounts",
  },
  {
    segmentId: "HIGH_VALUE_CUSTOMERS",
    title: "High-Value Customers",
    userCount: 85139,
    percentage: 0.23,
    profile: "High value, low churn risk, price tolerant, highly active",
    meaning: "Most valuable and loyal customers",
    behavior: "Regular bookings, complete purchases, low discount need",
    strategy: "Maintain relationship: premium rewards, 5-8% discounts",
  },
  {
    segmentId: "STANDARD_CUSTOMERS",
    title: "Standard Customers",
    userCount: 76027,
    percentage: 0.206,
    profile: "Medium value/risk, price tolerant, moderately active",
    meaning: "Average stable customers",
    behavior: "Occasional bookings, moderate spending",
    strategy: "Standard promos: 5-10% discounts",
  },
  {
    segmentId: "PRICE_SENSITIVE_CUSTOMERS",
    title: "Price-Sensitive Customers",
    userCount: 67600,
    percentage: 0.183,
    profile: "Low value, medium risk, highly price sensitive",
    meaning: "Active but price-focused",
    behavior: "Heavy price comparison, discount-driven, abandon if expensive",
    strategy: "Aggressive price promos: 12-18% discounts",
  },
  {
    segmentId: "PREMIUM_CUSTOMERS",
    title: "Premium Customers",
    userCount: 43097,
    percentage: 0.117,
    profile: "High value, medium risk, price tolerant, low activity",
    meaning: "High spenders, infrequent bookings",
    behavior: "Infrequent but high-value bookings",
    strategy: "Premium rewards: 5-8% discounts, exclusive offers",
  },
];

export const mockNotifications: NotificationOption[] = [
  {
    id: "n1",
    title: "Flight + Hotel Bundle",
    body: "Uçuşuna otel ekle, %15'e varan indirim!",
    targetSegmentIds: ["HIGH_VALUE_CUSTOMERS", "STANDARD_CUSTOMERS"],
    suggestedChannels: ["push", "email"],
    recommendedSendHoursUtc: [8, 9, 18],
    xaiPros: [
      "Eksik domain otel; bundle dönüşümü artırır",
      "Aktif saatlerde gönderim tıklamayı artırır",
    ],
    xaiCons: [
      "Tek seferlik yolculuklarda düşük ilgi",
      "Kayıtsız kullanıcılar için e-posta geçersiz",
    ],
  },
  {
    id: "n2",
    title: "Dönüş Biletini Unutma",
    body: "Gidiş yaptın, dönüş için en iyi fiyatlar seni bekliyor.",
    targetSegmentIds: ["AT_RISK_CUSTOMERS", "PRICE_SENSITIVE_CUSTOMERS", "STANDARD_CUSTOMERS"],
    suggestedChannels: ["push"],
    recommendedSendHoursUtc: [12, 20],
    xaiPros: ["Tek seferlik gidişlerde geri dönüş satışı sağlar"],
    xaiCons: ["Dönüş planı olmayanlarda alakasız olabilir"],
  },
];

export function getSchedulingSuggestionsForHour(hourUtc: number): SchedulingSuggestion[] {
  return [
    {
      hourUtc,
      rationale: `Kullanıcıların pik aktif saati ${hourUtc}:00 civarı`,
      confidence: 0.72,
    },
  ];
}


