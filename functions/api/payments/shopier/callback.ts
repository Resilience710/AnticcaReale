/**
 * Shopier Payment Callback Handler
 * POST /api/payments/shopier/callback
 * 
 * Handles the return redirect from Shopier after payment.
 * Verifies the payment and redirects user to success/fail page.
 */

interface Env {
  SHOPIER_API_KEY: string;
  SHOPIER_API_SECRET: string;
  FRONTEND_URL: string;
}

interface ShopierCallbackData {
  platform_order_id: string;
  API_key: string;
  status: 'success' | 'failed';
  installment: string | number;
  payment_id: string | number;
  random_nr: string | number;
  signature: string;
}

async function verifySignature(
  randomNr: string | number,
  orderId: string,
  signature: string,
  apiSecret: string
): Promise<boolean> {
  try {
    const dataToHash = `${randomNr}${orderId}`;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(apiSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const expectedSignatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(dataToHash)
    );
    
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(expectedSignatureBuffer)));
    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

async function parseFormData(request: Request): Promise<ShopierCallbackData | null> {
  try {
    const contentType = request.headers.get('content-type') || '';
    let params: URLSearchParams;
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      params = new URLSearchParams(text);
    } else if (contentType.includes('application/json')) {
      return await request.json() as ShopierCallbackData;
    } else {
      const text = await request.text();
      params = new URLSearchParams(text);
    }
    
    return {
      platform_order_id: params.get('platform_order_id') || '',
      API_key: params.get('API_key') || '',
      status: (params.get('status') || 'failed') as 'success' | 'failed',
      installment: params.get('installment') || '0',
      payment_id: params.get('payment_id') || '',
      random_nr: params.get('random_nr') || '',
      signature: params.get('signature') || '',
    };
  } catch (error) {
    console.error('Failed to parse callback data:', error);
    return null;
  }
}

function buildRedirectUrl(baseUrl: string, path: string, params: Record<string, string>): string {
  const url = new URL(path, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  const frontendUrl = env.FRONTEND_URL || 
    request.headers.get('origin') || 
    new URL(request.url).origin;

  try {
    const callbackData = await parseFormData(request);
    
    if (!callbackData) {
      return Response.redirect(
        buildRedirectUrl(frontendUrl, '/checkout/fail', { 
          error: 'parse_error',
          message: 'Ödeme verisi okunamadı'
        }),
        302
      );
    }

    console.log('Received Shopier callback:', {
      orderId: callbackData.platform_order_id,
      status: callbackData.status,
      paymentId: callbackData.payment_id,
    });

    if (!callbackData.platform_order_id || !callbackData.signature || !callbackData.random_nr) {
      return Response.redirect(
        buildRedirectUrl(frontendUrl, '/checkout/fail', { 
          error: 'validation_error',
          message: 'Eksik ödeme bilgisi'
        }),
        302
      );
    }

    // Verify signature if API_SECRET is available
    if (env.SHOPIER_API_SECRET) {
      const isValidSignature = await verifySignature(
        callbackData.random_nr,
        callbackData.platform_order_id,
        callbackData.signature,
        env.SHOPIER_API_SECRET
      );

      if (!isValidSignature) {
        return Response.redirect(
          buildRedirectUrl(frontendUrl, '/checkout/fail', { 
            error: 'signature_error',
            message: 'Ödeme doğrulanamadı',
            orderId: callbackData.platform_order_id
          }),
          302
        );
      }
    }

    // Redirect based on payment status
    if (callbackData.status === 'success') {
      return Response.redirect(
        buildRedirectUrl(frontendUrl, '/checkout/success', {
          orderId: callbackData.platform_order_id,
          paymentId: String(callbackData.payment_id),
          installment: String(callbackData.installment),
        }),
        302
      );
    } else {
      return Response.redirect(
        buildRedirectUrl(frontendUrl, '/checkout/fail', {
          orderId: callbackData.platform_order_id,
          error: 'payment_failed',
          message: 'Ödeme işlemi başarısız oldu'
        }),
        302
      );
    }

  } catch (error) {
    console.error('Callback processing error:', error);
    return Response.redirect(
      buildRedirectUrl(frontendUrl, '/checkout/fail', { 
        error: 'internal_error',
        message: 'Bir hata oluştu'
      }),
      302
    );
  }
};

// Handle GET request
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  const frontendUrl = env.FRONTEND_URL || 
    request.headers.get('origin') || 
    new URL(request.url).origin;
  
  const url = new URL(request.url);
  const orderId = url.searchParams.get('platform_order_id');
  const status = url.searchParams.get('status');
  
  if (orderId && status) {
    if (status === 'success') {
      return Response.redirect(
        buildRedirectUrl(frontendUrl, '/checkout/success', {
          orderId,
          paymentId: url.searchParams.get('payment_id') || '',
        }),
        302
      );
    } else {
      return Response.redirect(
        buildRedirectUrl(frontendUrl, '/checkout/fail', {
          orderId,
          error: 'payment_failed',
        }),
        302
      );
    }
  }
  
  return Response.redirect(frontendUrl, 302);
};
