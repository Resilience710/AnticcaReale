/**
 * Shopier Payment Service
 * Handles payment creation and redirection to Shopier payment page
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
  paymentUrl: string;
  formData: Record<string, string | number>;
}

export interface PaymentError {
  error: string;
  code: string;
  message?: string;
}

// API Base URL
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('pages.dev') || origin.includes('anticca')) {
      return origin;
    }
    return '';
  }
  return '';
};

/**
 * Create a Shopier payment session
 */
export async function createShopierPayment(
  request: CreatePaymentRequest
): Promise<PaymentFormData> {
  const apiUrl = `${getApiBaseUrl()}/api/payments/shopier/create`;
  
  console.log('Creating Shopier payment:', { orderId: request.orderId, amount: request.orderAmount });
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
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
  form.action = paymentData.paymentUrl;
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
    const apiUrl = `${getApiBaseUrl()}/api/payments/shopier/webhook`;
    const response = await fetch(apiUrl, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}
