// Anticca Type Definitions

export interface Shop {
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

export interface Product {
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

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  shopId: string;
  shopName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'Ödeme Bekleniyor'
  | 'Ödendi'
  | 'Hazırlanıyor'
  | 'Kargolandı'
  | 'Teslim Edildi'
  | 'İptal Edildi';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  userAddress?: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shopierTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 
  | 'Mobilya'
  | 'Tablo'
  | 'Objeler'
  | 'Aydınlatma'
  | 'Tekstil'
  | 'Seramik'
  | 'Cam'
  | 'Metal'
  | 'Saat'
  | 'Takı'
  | 'Kitap'
  | 'Diğer';

export type ProductEra = 
  | 'Osmanlı'
  | 'Cumhuriyet Dönemi'
  | 'Art Deco'
  | 'Art Nouveau'
  | 'Viktorya'
  | 'Barok'
  | 'Rokoko'
  | 'Modern'
  | 'Antik'
  | 'Diğer';

export const CATEGORIES: ProductCategory[] = [
  'Mobilya',
  'Tablo',
  'Objeler',
  'Aydınlatma',
  'Tekstil',
  'Seramik',
  'Cam',
  'Metal',
  'Saat',
  'Takı',
  'Kitap',
  'Diğer',
];

export const ERAS: ProductEra[] = [
  'Osmanlı',
  'Cumhuriyet Dönemi',
  'Art Deco',
  'Art Nouveau',
  'Viktorya',
  'Barok',
  'Rokoko',
  'Modern',
  'Antik',
  'Diğer',
];

export const ORDER_STATUSES: OrderStatus[] = [
  'Ödeme Bekleniyor',
  'Ödendi',
  'Hazırlanıyor',
  'Kargolandı',
  'Teslim Edildi',
  'İptal Edildi',
];

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  category?: ProductCategory;
  era?: ProductEra;
  shopId?: string;
  city?: string;
  district?: string;
  search?: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}
