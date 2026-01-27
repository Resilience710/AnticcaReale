/**
 * Shopier Payment Creation API
 * POST /api/payments/shopier/create
 * 
 * Creates a Shopier payment session and returns the payment form data
 * for client-side redirect to Shopier payment page.
 */

interface Env {
  SHOPIER_API_KEY: string;
  SHOPIER_API_SECRET: string;
  SHOPIER_CALLBACK_URL: string;
}

interface PaymentRequest {
  orderId: string;
  orderAmount: number; // in TRY
  currency?: number; // 0=TRY, 1=USD, 2=EUR (default: TRY)
  productName: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    accountAge?: number; // days since account creation
  };
  address: {
    address: string;
    city: string;
    country: string;
    postcode: string;
  };
  websiteIndex?: number; // 0-4 (default: 0)
}

interface PaymentFormData {
  paymentUrl: string;
  formData: Record<string, string | number>;
}

// Shopier Enums
const Currency = {
  TRY: 0,
  USD: 1,
  EUR: 2,
} as const;

const ProductType = {
  PHYSICAL: 0,
  DOWNLOADABLE_VIRTUAL: 1,
} as const;

const WebsiteIndex = {
  SITE_1: 0,
  SITE_2: 1,
  SITE_3: 2,
  SITE_4: 3,
  SITE_5: 4,
} as const;

const Language = {
  TR: 0,
  EN: 1,
} as const;

/**
 * Generate HMAC-SHA256 signature for Shopier
 * Signature = base64(HMAC-SHA256(random_nr + platform_order_id + total_order_value + currency, API_SECRET))
 */
async function generateSignature(
  randomNr: number,
  orderId: string,
  amount: string,
  currency: number,
  apiSecret: string
): Promise<string> {
  const dataToHash = `${randomNr}${orderId}${amount}${currency}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(apiSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToHash)
  );
  
  // Convert to base64
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return base64Signature;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    // Validate environment variables
    if (!env.SHOPIER_API_KEY || !env.SHOPIER_API_SECRET) {
      console.error('Missing Shopier credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Payment service not configured',
          code: 'CONFIG_ERROR' 
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse request body
    const body: PaymentRequest = await request.json();
    
    // Validate required fields
    if (!body.orderId || !body.orderAmount || !body.buyer || !body.address) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR',
          required: ['orderId', 'orderAmount', 'buyer', 'address']
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate random number for signature
    const randomNr = Math.floor(100000 + Math.random() * 900000);
    
    // Format amount (Shopier expects string with decimal)
    const formattedAmount = body.orderAmount.toFixed(2);
    
    // Currency (default TRY)
    const currency = body.currency ?? Currency.TRY;
    
    // Generate signature
    const signature = await generateSignature(
      randomNr,
      body.orderId,
      formattedAmount,
      currency,
      env.SHOPIER_API_SECRET
    );

    // Build callback URL
    const callbackUrl = env.SHOPIER_CALLBACK_URL || '';

    // Build Shopier form data
    const formData: Record<string, string | number> = {
      API_key: env.SHOPIER_API_KEY,
      website_index: body.websiteIndex ?? WebsiteIndex.SITE_1,
      platform_order_id: body.orderId,
      product_name: body.productName || 'Anticca Sipariş',
      product_type: ProductType.PHYSICAL,
      
      // Buyer info
      buyer_name: body.buyer.name,
      buyer_surname: body.buyer.surname,
      buyer_email: body.buyer.email,
      buyer_account_age: body.buyer.accountAge || 0,
      buyer_id_nr: body.buyer.id,
      buyer_phone: body.buyer.phone,
      
      // Billing address
      billing_address: body.address.address,
      billing_city: body.address.city,
      billing_country: body.address.country,
      billing_postcode: body.address.postcode,
      
      // Shipping address (same as billing)
      shipping_address: body.address.address,
      shipping_city: body.address.city,
      shipping_country: body.address.country,
      shipping_postcode: body.address.postcode,
      
      // Order info
      total_order_value: formattedAmount,
      currency: currency,
      
      // Platform info
      platform: 0,
      is_in_frame: 0,
      current_language: Language.TR,
      modul_version: '1.0.4',
      
      // Signature data
      random_nr: randomNr,
      signature: signature,
      
      // Callback URL (optional)
      ...(callbackUrl && { callback: callbackUrl }),
    };

    // Shopier payment URL
    const paymentUrl = 'https://www.shopier.com/ShowProduct/api_pay4.php';

    // Return payment data
    const response: PaymentFormData = {
      paymentUrl,
      formData,
    };

    console.log(`Payment created for order ${body.orderId}, amount: ${formattedAmount} TRY`);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create payment',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
