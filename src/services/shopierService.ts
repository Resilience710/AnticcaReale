/**
 * Shopier Payment Service
 * Firebase Cloud Functions ile entegre ödeme servisi
 */

// Types
export interface ShopierBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  accountAge?: number;
}

export interface ShopierAddress {
  address: string;
  city: string;
  country: string;
  postcode: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  orderAmount: number;
  currency?: number; // 0=TRY, 1=USD, 2=EUR
  productName: string;
  buyer: ShopierBuyer;
  address: ShopierAddress;
  websiteIndex?: number;
}

export interface PaymentFormData {
  success: boolean;
  shopierUrl: string;
  formData: Record<string, string | number>;
  orderId: string;
}

export interface PaymentError {
  error: string;
  code?: string;
  message?: string;
}

// Firebase Functions Base URL
// Production: europe-west1 bölgesinde deploy edilecek
const getFirebaseFunctionsUrl = (): string => {
  // Development modunda local emulator kullan
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    return 'http://localhost:5001/anticcareale/europe-west1';
  }
  
  // Production Firebase Functions URL
  return 'https://europe-west1-anticcareale.cloudfunctions.net';
};

/**
 * Create a Shopier payment session via Firebase Functions
 */
export async function createShopierPayment(
  request: CreatePaymentRequest
): Promise<PaymentFormData> {
  const functionsUrl = getFirebaseFunctionsUrl();
  const apiUrl = `${functionsUrl}/createShopierPayment`;
  
  console.log('Creating Shopier payment via Firebase Functions:', { 
    orderId: request.orderId, 
    amount: request.orderAmount,
    apiUrl
  });
  
  // Firebase Functions için body formatı
  const body = {
    orderId: request.orderId,
    amount: request.orderAmount,
    productName: request.productName,
    buyer: {
      id: request.buyer.id,
      name: `${request.buyer.name} ${request.buyer.surname}`,
      email: request.buyer.email,
      phone: request.buyer.phone,
      address: request.address.address,
      city: request.address.city
    }
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: PaymentError = await response.json().catch(() => ({
      error: 'Network error',
      code: 'NETWORK_ERROR',
    }));
    
    console.error('Payment creation failed:', errorData);
    throw new Error(errorData.message || errorData.error || 'Ödeme oluşturulamadı');
  }

  const data: PaymentFormData = await response.json();
  console.log('Payment created successfully:', { orderId: request.orderId });
  
  return data;
}

/**
 * Redirect to Shopier payment page via form POST
 */
export function redirectToShopierPayment(paymentData: PaymentFormData): void {
  console.log('Redirecting to Shopier payment page...');
  
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentData.shopierUrl;
  form.style.display = 'none';
  
  Object.entries(paymentData.formData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });
  
  document.body.appendChild(form);
  form.submit();
}

/**
 * Combined: Create payment and redirect
 */
export async function initiateShopierPayment(
  request: CreatePaymentRequest
): Promise<void> {
  try {
    const paymentData = await createShopierPayment(request);
    redirectToShopierPayment(paymentData);
  } catch (error) {
    console.error('Failed to initiate payment:', error);
    throw error;
  }
}

/**
 * Parse user name into first and last name
 */
export function parseUserName(fullName: string): { name: string; surname: string } {
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { name: parts[0], surname: '-' };
  }
  
  const surname = parts.pop() || '-';
  const name = parts.join(' ') || '-';
  
  return { name, surname };
}

/**
 * Format phone number for Shopier (10 digits)
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('90') && digits.length > 10) {
    return digits.slice(2);
  }
  
  if (digits.startsWith('0') && digits.length === 11) {
    return digits.slice(1);
  }
  
  return digits;
}

/**
 * Check if payment API is available
 */
export async function checkPaymentApiHealth(): Promise<boolean> {
  try {
    const functionsUrl = getFirebaseFunctionsUrl();
    // Firebase Functions health check - basit bir OPTIONS request
    const response = await fetch(`${functionsUrl}/createShopierPayment`, { 
      method: 'OPTIONS' 
    });
    return response.ok || response.status === 204;
  } catch {
    return false;
  }
}

/**
 * Get Firebase Functions callback URL for Shopier
 */
export function getShopierCallbackUrl(): string {
  const functionsUrl = getFirebaseFunctionsUrl();
  return `${functionsUrl}/shopierCallback`;
}
