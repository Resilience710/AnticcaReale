import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Shop, Product, Order, FilterState } from '../types';

// Generic hook for fetching a single document
export function useDocument<T>(collectionName: string, id: string | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchDoc() {
      try {
        if (!id) return;
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoc();
  }, [collectionName, id]);

  return { data, loading, error };
}

// Hook for fetching shops
export function useShops(activeOnly: boolean = true) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchShops() {
      try {
        const constraints: QueryConstraint[] = [];
        if (activeOnly) {
          constraints.push(where('isActive', '==', true));
        }
        constraints.push(orderBy('name'));

        const q = query(collection(db, 'shops'), ...constraints);
        const snapshot = await getDocs(q);
        
        const shopData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Shop[];
        
        setShops(shopData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, [activeOnly]);

  return { shops, loading, error };
}

// Hook for fetching products with filters
export function useProducts(filters?: FilterState, limitCount?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const constraints: QueryConstraint[] = [where('isActive', '==', true)];

        // Apply filters that can be done in Firestore
        if (filters?.category) {
          constraints.push(where('category', '==', filters.category));
        }
        if (filters?.era) {
          constraints.push(where('era', '==', filters.era));
        }
        if (filters?.shopId) {
          constraints.push(where('shopId', '==', filters.shopId));
        }

        // Sort
        if (filters?.sortBy === 'price-asc') {
          constraints.push(orderBy('price', 'asc'));
        } else if (filters?.sortBy === 'price-desc') {
          constraints.push(orderBy('price', 'desc'));
        } else {
          constraints.push(orderBy('createdAt', 'desc'));
        }

        if (limitCount) {
          constraints.push(limit(limitCount));
        }

        const q = query(collection(db, 'products'), ...constraints);
        const snapshot = await getDocs(q);
        
        let productData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Client-side filters for things Firestore can't handle efficiently
        if (filters?.minPrice !== undefined) {
          productData = productData.filter((p) => p.price >= filters.minPrice!);
        }
        if (filters?.maxPrice !== undefined) {
          productData = productData.filter((p) => p.price <= filters.maxPrice!);
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          productData = productData.filter(
            (p) =>
              p.name.toLowerCase().includes(searchLower) ||
              p.description.toLowerCase().includes(searchLower)
          );
        }

        setProducts(productData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters, limitCount]);

  return { products, loading, error, refetch: () => {} };
}

// Hook for fetching user orders
export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        
        const orderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        
        setOrders(orderData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  return { orders, loading, error };
}

// Hook for all orders (admin)
export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const orderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      
      setOrders(orderData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
}

// Admin functions
export async function createShop(shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'shops'), {
    ...shopData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateShop(id: string, data: Partial<Shop>) {
  await updateDoc(doc(db, 'shops', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteShop(id: string) {
  await deleteDoc(doc(db, 'shops', id));
}

export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  await updateDoc(doc(db, 'orders', id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// Fetch all products (admin)
export async function getAllProducts(activeOnly: boolean = false): Promise<Product[]> {
  const constraints: QueryConstraint[] = [];
  if (activeOnly) {
    constraints.push(where('isActive', '==', true));
  }
  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

// Fetch all shops (admin)
export async function getAllShops(activeOnly: boolean = false): Promise<Shop[]> {
  const constraints: QueryConstraint[] = [];
  if (activeOnly) {
    constraints.push(where('isActive', '==', true));
  }
  constraints.push(orderBy('name'));

  const q = query(collection(db, 'shops'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Shop[];
}
