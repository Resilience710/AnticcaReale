# Anticca — Antikanın Dijital Adresi

İstanbul'un saklı kalmış antikalarını keşfedin. Türkiye'nin en seçkin antikacılarından nadide parçalar, tek bir adreste.

## Proje Özeti

**Anticca**, İstanbul'daki antikacıların ürünlerini listeleyebildiği ve müşterilerin bu ürünleri inceleyip satın alabildiği bir antika komisyon platformudur.

### Özellikler

#### Müşteri Özellikleri
- 🏪 Dükkan ve ürün listelerini görüntüleme
- 🔍 Gelişmiş filtreleme sistemi (kategori, dönem, fiyat, dükkan)
- 🛒 Sepet yönetimi
- 📦 Sipariş takibi
- 👤 Kullanıcı hesabı yönetimi

#### Admin Özellikleri
- 🏛️ Dükkan ekleme/düzenleme/silme
- 📦 Ürün yönetimi (görsel yükleme dahil)
- 📋 Sipariş durumu güncelleme
- 📊 Dashboard istatistikleri

## Teknoloji Yığını

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Backend Services**: Firebase
  - Authentication (Email/Password)
  - Firestore (NoSQL Database)
  - Storage (Görsel depolama)
  - Analytics
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6

## URL'ler

### Geliştirme
- **Local**: http://localhost:3000
- **Sandbox**: https://3000-igqrq3zn9acxutuli73wy-cc2fbc16.sandbox.novita.ai

### Sayfalar
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Öne çıkan ürünler ve dükkanlar |
| Tüm Ürünler | `/products` | Filtrelenebilir ürün kataloğu |
| Ürün Detay | `/products/:id` | Ürün detay sayfası |
| Dükkanlar | `/shops` | Dükkan listesi |
| Dükkan Detay | `/shops/:id` | Dükkan ve ürünleri |
| Sepetim | `/cart` | Alışveriş sepeti |
| Siparişlerim | `/orders` | Kullanıcı siparişleri |
| Giriş | `/login` | Kullanıcı girişi |
| Kayıt | `/register` | Yeni hesap oluşturma |
| Admin Panel | `/admin` | Admin kontrol paneli |
| Admin Dükkanlar | `/admin/shops` | Dükkan yönetimi |
| Admin Ürünler | `/admin/products` | Ürün yönetimi |
| Admin Siparişler | `/admin/orders` | Sipariş yönetimi |

## Veri Modeli

### Shops (Dükkanlar)
```typescript
{
  id: string;
  name: string;
  description: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  logoUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Products (Ürünler)
```typescript
{
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  era: ProductEra;
  images: string[];
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Kategoriler
- Mobilya, Tablo, Objeler, Aydınlatma, Tekstil
- Seramik, Cam, Metal, Saat, Takı, Kitap, Diğer

### Dönemler
- Osmanlı, Cumhuriyet Dönemi, Art Deco, Art Nouveau
- Viktorya, Barok, Rokoko, Modern, Antik, Diğer

### Users (Kullanıcılar)
```typescript
{
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Orders (Siparişler)
```typescript
{
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### Sipariş Durumları
- Ödeme Bekleniyor → Ödendi → Hazırlanıyor → Kargolandı → Teslim Edildi
- İptal Edildi

## Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Kurulum Adımları

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Üretim derlemesi
npm run build

# Üretim önizlemesi
npm run preview
```

## Firebase Yapılandırması

Firebase konfigürasyonu `src/lib/firebase.ts` dosyasında bulunmaktadır.

### Firestore Güvenlik Kuralları

Güvenlik kuralları `firestore.rules` dosyasında tanımlanmıştır:
- Kullanıcılar sadece kendi siparişlerini görebilir
- Sadece adminler dükkan ve ürün ekleyebilir/düzenleyebilir
- Kullanıcılar sadece kendi profillerini düzenleyebilir

## Admin Hesabı Oluşturma

Admin hesabı oluşturmak için:

1. Normal kullanıcı olarak kayıt olun
2. Firebase Console'da Firestore'a gidin
3. `users` koleksiyonunda kullanıcınızı bulun
4. `role` alanını `admin` olarak değiştirin

## Shopier Ödeme Entegrasyonu

Şu an ödeme sistemi placeholder olarak eklenmiştir. Gerçek entegrasyon için:

1. Shopier API anahtarlarını alın
2. `src/pages/CartPage.tsx` dosyasındaki `handleCheckout` fonksiyonunu güncelleyin
3. Shopier callback URL'lerini ayarlayın

## Deployment

### Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name anticca
```

## Yapılacaklar

- [ ] Shopier gerçek entegrasyonu
- [ ] E-posta bildirimleri
- [ ] Favoriler özelliği
- [ ] Ürün yorumları
- [ ] Gelişmiş arama (Algolia)
- [ ] PWA desteği

## Lisans

Bu proje özel kullanım içindir.
