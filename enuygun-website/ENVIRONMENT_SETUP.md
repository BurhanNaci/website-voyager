# Enuygun Website - Environment Setup

## Kurulum

1. **Environment Variables**
   Proje kök dizininde `.env.local` dosyası oluşturun:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

2. **Backend Gereksinimleri**
   Voyager backend'inin `http://localhost:8080` adresinde çalıştığından emin olun.

3. **Projeyi Çalıştırma**
   ```bash
   cd /Users/burhan/Desktop/voyager/enuygun-website
   npm run dev
   ```

## Özellikler

- **Enuygun Tarzında UI**: Gerçek Enuygun sitesine benzer tasarım
- **Seyahat Ürünleri**: Uçak, otel, araç kiralama, otobüs biletleri
- **Sepet Sistemi**: Ürün ekleme/çıkarma, miktar güncelleme
- **Bildirim Sistemi**: Sepet terk etme bildirimleri
- **Backend Entegrasyonu**: Cart abandonment trigger sistemi

## Kullanım

1. Ana sayfada seyahat ürünlerini görüntüleyin
2. Ürünleri sepete ekleyin
3. Sepet panelini açın
4. "Sepeti Terk Et (Test)" butonuna tıklayın
5. Backend'e cart abandonment trigger gönderilir
6. Manager portalından onay beklenir

## API Endpoints

- `POST /api/notifications/triggers/cart-abandonment` - Sepet terk etme bildirimi tetikleme

## Test Senaryosu

1. Website'i açın (http://localhost:3000)
2. Birkaç ürünü sepete ekleyin
3. "Sepeti Terk Et (Test)" butonuna tıklayın
4. Manager portalını açın (http://localhost:3001)
5. Pending approvals bölümünde yeni bildirimi görün
6. Bildirimi onaylayın veya reddedin
