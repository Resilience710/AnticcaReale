# Anticca — Antikanın Dijital Adresi

İstanbul'un saklı kalmış antikalarını keşfedin. Türkiye'nin en seçkin antikacılarından nadide parçalar, tek bir adreste.

## Proje Özeti

**Anticca**, İstanbul'daki antikacıların ürünlerini listeleyebildiği ve müşterilerin bu ürünleri inceleyip satın alabildiği bir antika komisyon platformudur.

### Özellikler

#### Müşteri Özellikleri
- 🏪 Dükkan ve ürün listelerini görüntüleme
- 🔍 Gelişmiş filtreleme sistemi (kategori, dönem, fiyat, dükkan)
- 🛒 Sepet yönetimi
- 💳 Shopier ile güvenli ödeme
- 📦 Sipariş takibi
- 👤 Kullanıcı hesabı yönetimi
- 📝 Blog ve içerik sayfaları

#### Admin Özellikleri
- 🏛️ Dükkan ekleme/düzenleme/silme
- 📦 Ürün yönetimi (görsel yükleme dahil)
- 📋 Sipariş durumu güncelleme
- 📊 Dashboard istatistikleri
- ✍️ Blog yönetimi (Video & Zengin metin)

## Teknoloji Yığını

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Backend Services**: Firebase
  - Authentication (Email/Password)
  - Firestore (NoSQL Database)
  - Storage (Görsel depolama)
  - Cloud Functions (Ödeme API)
  - Analytics
- **Payment**: Shopier (Firebase Cloud Functions ile)
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6

## URL'ler

### Geliştirme
- **Local**: http://localhost:3000
- **Sandbox**: https://3000-igqrq3zn9acxutuli73wy-cc2fbc16.sandbox.novita.ai

### GitHub
- **Repository**: https://github.com/Resilience710/AnticcaReale

### Sayfalar
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Öne çıkan ürünler ve dükkanlar |
| Tüm Ürünler | `/products` | Filtrelenebilir ürün kataloğu |
| Ürün Detay | `/products/:id` | Ürün detay sayfası |
| Dükkanlar | `/shops` | Dükkan listesi |
| Dükkan Detay | `/shops/:id` | Dükkan ve ürünleri |
| Blog | `/blog` | Blog yazıları listesi |
| Blog Detay | `/blog/:slug` | Blog yazısı detayı |
| Sepetim | `/cart` | Alışveriş sepeti |
| Ödeme Başarılı | `/checkout/success` | Ödeme onay sayfası |
| Ödeme Başarısız | `/checkout/fail` | Ödeme hata sayfası |
| Siparişlerim | `/orders` | Kullanıcı siparişleri |
| Giriş | `/login` | Kullanıcı girişi |
| Kayıt | `/register` | Yeni hesap oluşturma |
| Admin Panel | `/admin` | Admin kontrol paneli |
| Admin Dükkanlar | `/admin/shops` | Dükkan yönetimi |
| Admin Ürünler | `/admin/products` | Ürün yönetimi |
| Admin Siparişler | `/admin/orders` | Sipariş yönetimi |
| Admin Blog | `/admin/blog` | Blog yönetimi |

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
  shopierTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Payments (Ödemeler)
```typescript
{
  orderId: string;
  amount: number;
  buyer: BuyerInfo;
  randomNr: string;
  status: 'pending' | 'completed' | 'failed';
  shopierPaymentId?: string;
  createdAt: Date;
}
```

### Sipariş Durumları
- Ödeme Bekleniyor → Ödendi → Hazırlanıyor → Kargolandı → Teslim Edildi
- İptal Edildi

## Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Kurulum Adımları

```bash
# Bağımlılıkları yükle
npm install

# Firebase Functions bağımlılıklarını yükle
cd firebase-functions && npm install && cd ..

# Geliştirme sunucusunu başlat
npm run dev

# Üretim derlemesi
npm run build

# Üretim önizlemesi
npm run preview
```

## Firebase Yapılandırması

Firebase konfigürasyonu `src/lib/firebase.ts` dosyasında bulunmaktadır.

### Firebase Console'da Yapılacaklar

1. **Firebase Console'a gidin**: https://console.firebase.google.com/project/anticcareale

2. **Cloud Functions'ı etkinleştirin**: 
   - Sol menüden "Functions" seçin
   - "Get started" ile etkinleştirin
   - Blaze planına geçiş gerekli (kullandıkça öde)

3. **Firestore Güvenlik Kuralları**:
   Güvenlik kuralları `firestore.rules` dosyasında tanımlanmıştır:
   - Kullanıcılar sadece kendi siparişlerini görebilir
   - Sadece adminler dükkan ve ürün ekleyebilir/düzenleyebilir
   - Kullanıcılar sadece kendi profillerini düzenleyebilir

## Shopier Ödeme Entegrasyonu

### Yapılandırma

#### 1. Firebase Functions Secrets Ayarlama (Firebase Console)

Firebase Console'da yapılacak adımlar:

1. **Firebase Console > Project Settings > Service accounts**
2. Sol menüden **Functions** seçin
3. **Configuration** sekmesine tıklayın
4. Aşağıdaki environment variables'ları ekleyin:

| Variable | Açıklama |
|----------|----------|
| `SHOPIER_API_KEY` | Shopier API Key |
| `SHOPIER_API_SECRET` | Shopier API Secret |
| `SHOPIER_CALLBACK_URL` | `https://europe-west1-anticcareale.cloudfunctions.net/shopierCallback` |
| `FRONTEND_URL` | `https://anticcareale.web.app` |

**Alternatif: Terminal ile yapılandırma:**
```bash
# Firebase login
firebase login

# Secrets ayarla
firebase functions:secrets:set SHOPIER_API_KEY
firebase functions:secrets:set SHOPIER_API_SECRET
firebase functions:secrets:set SHOPIER_CALLBACK_URL
firebase functions:secrets:set FRONTEND_URL
```

#### 2. Shopier Panel Ayarları

Shopier satıcı panelinde yapılacaklar:

1. **Hesabım → Satıcı Hesabı → API Bilgileri**'ne gidin
2. API Key ve API Secret'ı kopyalayın
3. **Callback URL**: `https://europe-west1-anticcareale.cloudfunctions.net/shopierCallback`
4. **Webhook URL**: `https://europe-west1-anticcareale.cloudfunctions.net/shopierWebhook`

### Firebase Functions Deploy

```bash
# Firebase login
firebase login

# Functions deploy
firebase deploy --only functions

# Sadece functions:shopier deploy
firebase deploy --only functions:createShopierPayment,functions:shopierWebhook,functions:shopierCallback
```

### Ödeme Akışı

```
1. Kullanıcı "Shopier ile Öde" tıklar
2. Frontend → POST createShopierPayment
3. Firebase Function → Firestore'a payment kaydı oluşturur
4. Function → Form data + signature döner
5. Frontend → Hidden form ile Shopier'a redirect
6. Kullanıcı Shopier'da ödeme yapar
7. Shopier → POST shopierCallback (kullanıcı yönlendirme)
8. Shopier → POST shopierWebhook (ödeme bildirimi)
9. Function → İmza doğrular, sipariş günceller
10. Kullanıcı → /checkout/success veya /checkout/fail
```

### API Endpoints (Firebase Cloud Functions)

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/createShopierPayment` | POST | Ödeme oturumu oluşturma |
| `/shopierWebhook` | POST | Ödeme bildirimi (Shopier → Server) |
| `/shopierCallback` | GET/POST | Kullanıcı yönlendirme |

**Tam URL'ler:**
- `https://europe-west1-anticcareale.cloudfunctions.net/createShopierPayment`
- `https://europe-west1-anticcareale.cloudfunctions.net/shopierWebhook`
- `https://europe-west1-anticcareale.cloudfunctions.net/shopierCallback`

## Admin Hesabı Oluşturma

Admin hesabı oluşturmak için:

1. Normal kullanıcı olarak kayıt olun
2. Firebase Console'da Firestore'a gidin
3. `users` koleksiyonunda kullanıcınızı bulun
4. `role` alanını `admin` olarak değiştirin

## Deployment

### Firebase Hosting + Functions

```bash
# Build
npm run build

# Deploy (Hosting + Functions)
firebase deploy

# Sadece Hosting
firebase deploy --only hosting

# Sadece Functions
firebase deploy --only functions
```

### Local Development (Emulator)

```bash
# Firebase Emulators'ı başlat
firebase emulators:start

# Frontend'de emulator kullanmak için
# .env.local dosyasına ekleyin:
VITE_USE_EMULATOR=true
```

## Dosya Yapısı

```
webapp/
├── src/
│   ├── components/        # React bileşenleri
│   ├── contexts/          # React context'leri
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Firebase config
│   ├── pages/             # Sayfa bileşenleri
│   ├── services/          # API servisleri
│   └── types/             # TypeScript tipleri
├── firebase-functions/    # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts       # Shopier payment functions
│   ├── package.json
│   └── tsconfig.json
├── firebase.json          # Firebase yapılandırması
├── firestore.rules        # Güvenlik kuralları
├── firestore.indexes.json # Firestore index'leri
└── .firebaserc            # Firebase proje ayarları
```

## Yapılacaklar

- [x] Shopier entegrasyonu (Firebase Cloud Functions)
- [x] Blog modülü
- [ ] E-posta bildirimleri
- [ ] Favoriler özelliği
- [ ] Ürün yorumları
- [ ] Gelişmiş arama (Algolia)
- [ ] PWA desteği

## Sorun Giderme

### Firebase Functions Deploy Hataları

1. **Blaze planı gerekli**: Functions için Blaze planına geçiş yapın
2. **Node.js sürümü**: `firebase-functions/package.json` içinde `"engines": {"node": "18"}` olmalı
3. **Region hatası**: Functions `europe-west1` bölgesinde deploy edilmeli

### Ödeme Hataları

1. **Signature hatası**: API Secret doğru girildiğinden emin olun
2. **Callback hatası**: Shopier panelinde doğru URL'leri girin
3. **CORS hatası**: Functions'ta CORS middleware aktif olmalı

## Lisans

Bu proje özel kullanım içindir.
