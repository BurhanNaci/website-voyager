// Enuygun Website Types

export interface TravelItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: 'flight' | 'hotel' | 'car' | 'bus';
  location: string;
  duration?: string;
  rating?: number;
  description: string;
}

export interface CartItem extends TravelItem {
  quantity: number;
  selectedDate?: string;
  passengers?: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  user_id: number;
  last_updated: string;
}

export interface CartAbandonmentRequest {
  user_id: number;
  cart_items: string[];
  hours: number;
}

export interface CartAbandonmentResponse {
  campaign_id: string;
  status: "pending_approval";
}

export interface Notification {
  id: string;
  type: 'cart_abandonment' | 'discount_offer' | 'reminder';
  title: string;
  message: string;
  discount?: number;
  is_read: boolean;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  segment?: string;
}
