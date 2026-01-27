/**
 * Shopier Webhook Handler
 * POST /api/payments/shopier/webhook
 * 
 * Handles payment callbacks from Shopier after payment completion.
 * Verifies signature and updates order status.
 */

interface Env {
  SHOPIER_API_KEY: string;
  SHOPIER_API_SECRET: string;
}

interface ShopierWebhookData {
  platform_order_id: string;
  API_key: string;
  status: 'success' | 'failed';
  installment: string | number;
  payment_id: string | number;
  random_nr: string | number;
  signature: string;
}

/**
 * Verify Shopier webhook signature
 * Expected Signature = base64(HMAC-SHA256(random_nr + platform_order_id, API_SECRET))
 */
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

async function parseFormData(request: Request): Promise<ShopierWebhookData | null> {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      
      return {
        platform_order_id: params.get('platform_order_id') || '',
        API_key: params.get('API_key') || '',
        status: (params.get('status') || 'failed') as 'success' | 'failed',
        installment: params.get('installment') || '0',
        payment_id: params.get('payment_id') || '',
        random_nr: params.get('random_nr') || '',
        signature: params.get('signature') || '',
      };
    }
    
    if (contentType.includes('application/json')) {
      return await request.json();
    }
    
    const text = await request.text();
    const params = new URLSearchParams(text);
    
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
    console.error('Failed to parse webhook data:', error);
    return null;
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  const headers = { 'Content-Type': 'application/json' };

  try {
    if (!env.SHOPIER_API_SECRET) {
      console.error('Missing SHOPIER_API_SECRET');
      return new Response(
        JSON.stringify({ success: false, message: 'Webhook handler not configured' }),
        { status: 500, headers }
      );
    }

    const webhookData = await parseFormData(request);
    
    if (!webhookData) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid webhook data' }),
        { status: 400, headers }
      );
    }

    console.log('Received Shopier webhook:', {
      orderId: webhookData.platform_order_id,
      status: webhookData.status,
      paymentId: webhookData.payment_id,
      timestamp: new Date().toISOString(),
    });

    if (!webhookData.platform_order_id || !webhookData.signature || !webhookData.random_nr) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Verify signature
    const isValidSignature = await verifySignature(
      webhookData.random_nr,
      webhookData.platform_order_id,
      webhookData.signature,
      env.SHOPIER_API_SECRET
    );

    if (!isValidSignature) {
      console.error('Invalid signature in webhook');
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid signature' }),
        { status: 401, headers }
      );
    }

    console.log('Webhook verified:', {
      orderId: webhookData.platform_order_id,
      paymentId: webhookData.payment_id,
      status: webhookData.status,
    });

    // Return success - order update handled by callback or client
    return new Response(
      JSON.stringify({
        success: true,
        message: webhookData.status === 'success' ? 'Payment verified' : 'Payment failed',
        orderId: webhookData.platform_order_id,
        paymentId: String(webhookData.payment_id),
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Webhook processing failed' }),
      { status: 200, headers }
    );
  }
};

// Health check
export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(
    JSON.stringify({ 
      status: 'ok',
      endpoint: 'Shopier Webhook Handler',
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
