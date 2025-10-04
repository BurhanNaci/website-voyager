'use client';

import { useState, useEffect } from 'react';
import { 
  Plane, 
  Hotel, 
  Car, 
  Bus, 
  ShoppingCart, 
  Bell, 
  Search, 
  Calendar,
  Users,
  Star,
  MapPin,
  Clock,
  X,
  Plus,
  Minus,
  Heart
} from 'lucide-react';
import { TravelItem, CartItem, Cart, Notification } from '@/lib/types';
import { cartAbandonmentApi, mockUser, getMockNotifications } from '@/lib/api';

export default function EnuygunHomePage() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    user_id: mockUser.id,
    last_updated: new Date().toISOString(),
  });
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample travel items
  const travelItems: TravelItem[] = [
    {
      id: '1',
      name: 'İstanbul - Antalya Uçak Bileti',
      price: 450,
      originalPrice: 600,
      discount: 25,
      image: '/api/placeholder/300/200',
      category: 'flight',
      location: 'Antalya',
      duration: '1 saat 30 dk',
      rating: 4.5,
      description: 'THY ile konforlu uçuş deneyimi'
    },
    {
      id: '2',
      name: 'Grand Hotel Antalya',
      price: 1200,
      originalPrice: 1500,
      discount: 20,
      image: '/api/placeholder/300/200',
      category: 'hotel',
      location: 'Antalya Merkez',
      duration: '3 gece',
      rating: 4.8,
      description: 'Deniz manzaralı lüks otel'
    },
    {
      id: '3',
      name: 'Araç Kiralama - Ekonomik',
      price: 300,
      originalPrice: 400,
      discount: 25,
      image: '/api/placeholder/300/200',
      category: 'car',
      location: 'Antalya Havalimanı',
      duration: '2 gün',
      rating: 4.2,
      description: 'Günlük 150 TL\'den başlayan fiyatlarla'
    },
    {
      id: '4',
      name: 'İstanbul - İzmir Otobüs',
      price: 180,
      originalPrice: 220,
      discount: 18,
      image: '/api/placeholder/300/200',
      category: 'bus',
      location: 'İzmir',
      duration: '8 saat',
      rating: 4.0,
      description: 'Konforlu seyahat deneyimi'
    }
  ];

  // Load notifications on mount
  useEffect(() => {
    setNotifications(getMockNotifications());
  }, []);

  const addToCart = (item: TravelItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        const updatedItems = prevCart.items.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        return {
          ...prevCart,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          last_updated: new Date().toISOString(),
        };
      } else {
        const newItems = [...prevCart.items, { ...item, quantity: 1 }];
        return {
          ...prevCart,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          last_updated: new Date().toISOString(),
        };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return {
        ...prevCart,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        last_updated: new Date().toISOString(),
      };
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      return {
        ...prevCart,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        last_updated: new Date().toISOString(),
      };
    });
  };

  const triggerCartAbandonment = async () => {
    if (cart.items.length === 0) return;

    setIsLoading(true);
    try {
      const cartItemNames = cart.items.map(item => item.name);
      await cartAbandonmentApi.trigger({
        user_id: mockUser.id,
        cart_items: cartItemNames,
        hours: 1,
      });
      
      alert('Sepet terk etme bildirimi tetiklendi! Manager portalından onay bekleniyor.');
    } catch (error) {
      console.error('Failed to trigger cart abandonment:', error);
      alert('Bildirim tetiklenirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'hotel': return <Hotel className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      case 'bus': return <Bus className="w-5 h-5" />;
      default: return <Plane className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flight': return 'bg-blue-100 text-blue-600';
      case 'hotel': return 'bg-green-100 text-green-600';
      case 'car': return 'bg-purple-100 text-purple-600';
      case 'bus': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read).length;
  const filteredItems = travelItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-orange-600">Enuygun</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nereye gitmek istiyorsunuz?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Bildirimler</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">
                          Henüz bildirim yok
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b hover:bg-gray-50 ${
                              !notification.is_read ? 'bg-orange-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                {notification.discount && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                    %{notification.discount} İndirim
                                  </span>
                                )}
                              </div>
                              <button className="ml-2 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-sm font-medium">
                  {cart.items.length} ürün
                </span>
                {cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            En İyi Seyahat Fırsatlarını Keşfedin
          </h2>
          <p className="text-xl mb-8">
            Uçak, otel, araç kiralama ve otobüs biletlerinde en uygun fiyatlar
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Uçak Bileti
            </button>
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Otel Rezervasyonu
            </button>
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Araç Kiralama
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Travel Items */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popüler Seyahat Ürünleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category === 'flight' && 'Uçak'}
                        {item.category === 'hotel' && 'Otel'}
                        {item.category === 'car' && 'Araç'}
                        {item.category === 'bus' && 'Otobüs'}
                      </span>
                      {item.discount && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          %{item.discount} İndirim
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{item.location}</span>
                      {item.duration && (
                        <>
                          <Clock className="w-4 h-4 ml-3 mr-1" />
                          <span>{item.duration}</span>
                        </>
                      )}
                    </div>
                    
                    {item.rating && (
                      <div className="flex items-center mb-4">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-orange-600">₺{item.price}</span>
                        {item.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₺{item.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Sepete Ekle</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="w-96 bg-white rounded-lg shadow-sm border p-6 sticky top-24 h-fit">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Sepetim</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {cart.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Sepetiniz boş</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-orange-600 font-semibold">₺{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-orange-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-orange-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-600 hover:text-red-700 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Toplam:</span>
                      <span className="text-xl font-bold text-orange-600">₺{cart.total}</span>
                    </div>
                    
                    <button
                      onClick={triggerCartAbandonment}
                      disabled={isLoading}
                      className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                    >
                      {isLoading ? 'Gönderiliyor...' : 'Sepeti Terk Et (Test)'}
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Bu buton sepet terk etme bildirimini tetikler
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}