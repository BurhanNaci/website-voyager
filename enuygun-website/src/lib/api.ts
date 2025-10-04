import axios from 'axios';
import { CartAbandonmentRequest, CartAbandonmentResponse, Notification, User } from './types';

// API Configuration
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Functions
export const cartAbandonmentApi = {
  // Trigger cart abandonment notification
  async trigger(request: CartAbandonmentRequest): Promise<CartAbandonmentResponse> {
    try {
      const { data } = await api.post<CartAbandonmentResponse>(
        '/api/notifications/triggers/cart-abandonment',
        {}, // ✅ Body boş gönder
        {
          params: {  // ✅ Query parametrelerini buraya ekle
            user_id: 295,
            hours: 10
          }
        }
      );
      return data;
    } catch (error) {
      console.error('Error triggering cart abandonment:', error);
      throw error;
    }
  },
};
// Mock user data
export const mockUser: User = {
  id: 295,
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  phone: '+90 555 123 4567',
  segment: 'at_risk_customers',
};

// Mock notifications (in real app, this would come from API)
export const getMockNotifications = (): Notification[] => [
  {
    id: '1',
    type: 'cart_abandonment',
    title: 'Sepetinizde ürünler bekliyor!',
    message: 'Sepetinizdeki seyahat ürünlerini kaçırmayın. Özel indirim fırsatı!',
    discount: 15,
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'discount_offer',
    title: 'Özel İndirim Fırsatı!',
    message: 'Antalya seyahatiniz için %20 indirim kazanın!',
    discount: 20,
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export { api };
