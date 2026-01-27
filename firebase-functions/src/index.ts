/**
 * Firebase Cloud Functions for Anticca
 * Shopier Payment Integration
 * 
 * Functions:
 * - createShopierPayment: Ödeme oturumu oluşturur
 * - shopierWebhook: Shopier'dan gelen ödeme bildirimlerini işler
 * - shopierCallback: Ödeme sonrası kullanıcı yönlendirmesi
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import cors from 'cors';

// Firebase Admin SDK'yı başlat
admin.initializeApp();
const db = admin.firestore();

// CORS middleware
const corsHandler = cors({ origin: true });

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Shopier HMAC-SHA256 signature hesaplama
 * PHP SDK ile aynı algoritma
 */
function generateShopierSignature(data: string, apiSecret: string): string {
  return crypto
    .createHmac('sha256', apiSecret)
    .update(data)
    .digest('base64');
}

/**
 * Shopier callback signature doğrulama
 */
function verifyShopierSignature(
  randomNr: string,
  platformOrderId: string,
  status: string,
  signature: string,
  apiSecret: string
): boolean {
  const data = `${randomNr}${platformOrderId}${status}`;
  const expectedSignature = generateShopierSignature(data, apiSecret);
  return signature === expectedSignature;
}

/**
 * Rastgele string üretici
 */
function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

// ============================================
// SHOPIER PAYMENT ENDPOINTS
// ============================================

/**
 * Shopier ödeme oturumu oluşturma
 * POST /createShopierPayment
 * 
 * Body:
 * - orderId: Firebase order ID
 * - amount: Ödeme tutarı (TRY)
 * - buyer: { name, email, phone, address, city }
 * - productName: Ürün/sipariş adı
 */
export const createShopierPayment = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      // Sadece POST kabul et
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      try {
        // Environment variables'dan API bilgilerini al
        const apiKey = process.env.SHOPIER_API_KEY || functions.config().shopier?.api_key;
        const apiSecret = process.env.SHOPIER_API_SECRET || functions.config().shopier?.api_secret;
        const callbackUrl = process.env.SHOPIER_CALLBACK_URL || functions.config().shopier?.callback_url;
        // frontendUrl kullanılacaksa burada tanımlanabilir
        // const frontendUrl = process.env.FRONTEND_URL || functions.config().shopier?.frontend_url;

        if (!apiKey || !apiSecret || !callbackUrl) {
          console.error('Shopier configuration missing');
          res.status(500).json({ error: 'Payment configuration error' });
          return;
        }

        const { orderId, amount, buyer, productName } = req.body;

        // Validasyon
        if (!orderId || !amount || !buyer || !buyer.email) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }

        // Random number (Shopier gereksinimleri)
        const randomNr = generateRandomString(32);

        // Buyer bilgilerini hazırla
        const buyerData = {
          id: buyer.id || orderId,
          product_name: productName || `Sipariş #${orderId}`,
          first_name: buyer.name?.split(' ')[0] || 'Müşteri',
          last_name: buyer.name?.split(' ').slice(1).join(' ') || '',
          email: buyer.email,
          phone: buyer.phone || '',
          address: buyer.address || '',
          city: buyer.city || 'İstanbul',
          country: 'TR',
          postal_code: ''
        };

        // Module ve callback verileri
        const moduleData = {
          module_version: '1.0.0',
          random_nr: randomNr
        };

        // Signature için data string - PHP SDK ile aynı format
        const signatureData = [
          apiKey,
          buyerData.id,
          buyerData.product_name,
          amount.toFixed(2),
          'TRY',
          randomNr
        ].join('');

        const signature = generateShopierSignature(signatureData, apiSecret);

        // Shopier form verileri
        const formData = {
          API_key: apiKey,
          website_index: '0', // Site 1
          platform_order_id: orderId,
          product_name: buyerData.product_name,
          product_type: 1, // Fiziksel ürün
          buyer_name: buyerData.first_name,
          buyer_surname: buyerData.last_name,
          buyer_email: buyerData.email,
          buyer_phone: buyerData.phone,
          buyer_address: buyerData.address,
          buyer_city: buyerData.city,
          buyer_country: buyerData.country,
          buyer_postal_code: buyerData.postal_code,
          total_order_value: amount.toFixed(2),
          currency: 'TRY',
          platform: 'Firebase',
          is_in_frame: '0', // Iframe değil, redirect
          current_language: 'tr-TR',
          modul_version: moduleData.module_version,
          random_nr: randomNr,
          signature: signature,
          callback_url: callbackUrl
        };

        // Firestore'a ödeme kaydı oluştur
        await db.collection('payments').doc(orderId).set({
          orderId,
          amount,
          buyer: buyerData,
          randomNr,
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Form verilerini ve Shopier URL'ini döndür
        res.status(200).json({
          success: true,
          shopierUrl: 'https://www.shopier.com/ShowProduct/api_pay4.php',
          formData,
          orderId
        });

      } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ error: 'Payment creation failed' });
      }
    });
  });

/**
 * Shopier Webhook Handler
 * POST /shopierWebhook
 * 
 * Shopier ödeme tamamlandığında bu endpoint'e bildirim gönderir
 */
export const shopierWebhook = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    // Sadece POST kabul et
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const apiSecret = process.env.SHOPIER_API_SECRET || functions.config().shopier?.api_secret;

      if (!apiSecret) {
        console.error('API secret not configured');
        res.status(500).json({ error: 'Configuration error' });
        return;
      }

      // Shopier webhook verileri
      const {
        platform_order_id,
        status,
        payment_id,
        random_nr,
        signature,
        installment
        // API_key - Shopier'dan gelen ama kullanmadığımız alan
      } = req.body;

      console.log('Webhook received:', {
        platform_order_id,
        status,
        payment_id,
        random_nr
      });

      // Signature doğrulama
      if (!verifyShopierSignature(random_nr, platform_order_id, status, signature, apiSecret)) {
        console.error('Invalid signature');
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }

      // Ödeme kaydını güncelle
      const paymentRef = db.collection('payments').doc(platform_order_id);
      const paymentDoc = await paymentRef.get();

      if (!paymentDoc.exists) {
        console.error('Payment not found:', platform_order_id);
        res.status(404).json({ error: 'Payment not found' });
        return;
      }

      // İdempotentlik kontrolü
      const paymentData = paymentDoc.data();
      if (paymentData?.shopierPaymentId === payment_id) {
        console.log('Webhook already processed:', payment_id);
        res.status(200).json({ success: true, message: 'Already processed' });
        return;
      }

      // Ödeme durumunu güncelle
      const newStatus = status === 'success' ? 'completed' : 'failed';
      await paymentRef.update({
        status: newStatus,
        shopierPaymentId: payment_id,
        shopierStatus: status,
        installment: installment || 0,
        webhookReceivedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Sipariş durumunu güncelle
      if (status === 'success') {
        const orderRef = db.collection('orders').doc(platform_order_id);
        await orderRef.update({
          status: 'Ödendi',
          shopierTransactionId: payment_id,
          paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('Order marked as paid:', platform_order_id);
      }

      res.status(200).json({ success: true });

    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

/**
 * Shopier Callback Handler
 * GET/POST /shopierCallback
 * 
 * Kullanıcı ödeme sonrası bu sayfaya yönlendirilir
 */
export const shopierCallback = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    try {
      const apiSecret = process.env.SHOPIER_API_SECRET || functions.config().shopier?.api_secret;
      const frontendUrl = process.env.FRONTEND_URL || functions.config().shopier?.frontend_url || 'https://anticcareale.web.app';

      // Shopier callback verileri (GET veya POST)
      const data = req.method === 'POST' ? req.body : req.query;
      
      const {
        platform_order_id,
        status,
        payment_id,
        random_nr,
        signature
      } = data;

      console.log('Callback received:', {
        platform_order_id,
        status,
        payment_id,
        method: req.method
      });

      // Signature doğrulama (varsa)
      if (signature && apiSecret) {
        const isValid = verifyShopierSignature(
          random_nr as string,
          platform_order_id as string,
          status as string,
          signature as string,
          apiSecret
        );

        if (!isValid) {
          console.warn('Invalid callback signature');
          // Yine de kullanıcıyı yönlendir, ama hata sayfasına
          res.redirect(`${frontendUrl}/checkout/fail?error=invalid_signature`);
          return;
        }
      }

      // Başarılı ödeme
      if (status === 'success') {
        // Ödeme kaydını güncelle
        if (platform_order_id) {
          const paymentRef = db.collection('payments').doc(platform_order_id as string);
          const paymentDoc = await paymentRef.get();
          
          if (paymentDoc.exists) {
            await paymentRef.update({
              callbackReceived: true,
              callbackStatus: status,
              callbackReceivedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          }
        }

        res.redirect(`${frontendUrl}/checkout/success?orderId=${platform_order_id}&paymentId=${payment_id}`);
      } else {
        // Başarısız ödeme
        res.redirect(`${frontendUrl}/checkout/fail?orderId=${platform_order_id}&status=${status}`);
      }

    } catch (error) {
      console.error('Callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || functions.config().shopier?.frontend_url || 'https://anticcareale.web.app';
      res.redirect(`${frontendUrl}/checkout/fail?error=processing_error`);
    }
  });
