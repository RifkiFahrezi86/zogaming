// WhatsApp notification via Fonnte API
// Register at https://fonnte.com to get your API token
// Token yang dipakai: Device Token (dari menu Devices di fonnte.com)

const FONNTE_API_URL = 'https://api.fonnte.com/send';

interface SendMessageParams {
  phone: string;  // Format: 6285xxxxxxxxx (with country code)
  message: string;
}

export function getAdminPhone(): string {
  return process.env.ADMIN_WHATSAPP || '6285954092060';
}

export async function sendWhatsApp({ phone, message }: SendMessageParams): Promise<boolean> {
  const token = process.env.FONNTE_API_TOKEN;
  
  if (!token || token === 'your-fonnte-api-token') {
    console.log('[WhatsApp] Token not configured. Message would be sent to:', phone);
    console.log('[WhatsApp] Message:', message);
    return process.env.NODE_ENV !== 'production';
  }

  try {
    // Fonnte API requires form-data, NOT JSON
    const formData = new URLSearchParams();
    formData.append('target', phone);
    formData.append('message', message);
    formData.append('countryCode', '62');

    console.log('[WhatsApp] Sending to:', phone);
    console.log('[WhatsApp] Token (first 10):', token.substring(0, 10) + '...');

    const response = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: formData,
    });

    const data = await response.json();
    console.log('[WhatsApp] Response status:', response.status);
    console.log('[WhatsApp] Send result:', JSON.stringify(data));
    
    // Fonnte returns { status: true, detail: "...", ... } on success
    if (data.status === true || data.status === 'true') {
      console.log('[WhatsApp] Message sent successfully to', phone);
      return true;
    } else {
      console.error('[WhatsApp] Failed:', data.reason || data.detail || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('[WhatsApp] Failed to send:', error);
    return false;
  }
}

// ==================== ADMIN NOTIFICATIONS ====================

// Notify admin about NEW ORDER (immediately when customer orders)
export async function notifyAdminNewOrder(
  orderNumber: string,
  customerName: string,
  customerPhone: string,
  productName: string,
  total: number
): Promise<boolean> {
  const adminPhone = getAdminPhone();
  const message = `🛒 *PESANAN BARU MASUK!*\n\n` +
    `Order: *${orderNumber}*\n` +
    `👤 Nama: ${customerName}\n` +
    `📱 WhatsApp: ${customerPhone}\n` +
    `🎮 Produk: ${productName}\n` +
    `💰 Total: Rp ${total.toLocaleString('id-ID')}\n\n` +
    `⏳ Menunggu pembayaran customer.\n` +
    `Buka Admin Panel untuk detail.`;

  return sendWhatsApp({ phone: adminPhone, message });
}

// Notify admin when customer CONFIRMS payment
export async function notifyAdminPaymentConfirm(
  orderNumber: string,
  customerName: string,
  customerPhone: string,
  productName: string,
  total: number,
  paymentMethod: string
): Promise<boolean> {
  const adminPhone = getAdminPhone();
  const message = `💳 *KONFIRMASI PEMBAYARAN*\n\n` +
    `Order: *${orderNumber}*\n` +
    `👤 Nama: ${customerName}\n` +
    `📱 WhatsApp: ${customerPhone}\n` +
    `🎮 Produk: ${productName}\n` +
    `💰 Total: Rp ${total.toLocaleString('id-ID')}\n` +
    `💳 Metode: ${paymentMethod}\n\n` +
    `🔔 *Customer sudah bayar!*\n` +
    `Segera verifikasi di Admin Panel.`;

  return sendWhatsApp({ phone: adminPhone, message });
}

// Notify admin about verified payment (legacy, still useful)
export async function notifyAdminPayment(orderNumber: string, customerName: string, total: number): Promise<boolean> {
  const adminPhone = getAdminPhone();
  const message = `✅ *PEMBAYARAN DIVERIFIKASI*\n\n` +
    `Order *${orderNumber}* sudah diverifikasi dan siap diproses.\n\n` +
    `👤 Customer: ${customerName}\n` +
    `💰 Total: Rp ${total.toLocaleString('id-ID')}\n\n` +
    `Silakan input akun dan kirim ke customer.`;
  
  return sendWhatsApp({ phone: adminPhone, message });
}

// ==================== CUSTOMER NOTIFICATIONS ====================

// Notify customer about processing status
export async function notifyCustomerProcessing(phone: string, orderNumber: string): Promise<boolean> {
  const message = `✅ *PEMBAYARAN DITERIMA*\n\n` +
    `Halo! Pembayaran untuk order *${orderNumber}* telah diterima.\n\n` +
    `Pesanan Anda sedang diproses oleh admin.\n\n` +
    `⏰ *Estimasi waktu: Maksimal 30 menit*\n` +
    `Jika lebih dari 30 menit pesanan belum diterima, uang akan dikembalikan.\n\n` +
    `Terima kasih telah berbelanja di ZOGAMING! 🎮`;
  
  return sendWhatsApp({ phone, message });
}

// Notify customer about account delivery
export async function notifyCustomerDelivery(
  phone: string, 
  orderNumber: string, 
  accountEmail: string, 
  accountPassword: string
): Promise<boolean> {
  const message = `🎮 *PESANAN SELESAI*\n\n` +
    `Order ID: *${orderNumber}*\n\n` +
    `Berikut akun Anda:\n` +
    `📧 Email: ${accountEmail}\n` +
    `🔑 Password: ${accountPassword}\n\n` +
    `Segera ubah password setelah login.\n` +
    `Terima kasih telah berbelanja di ZOGAMING! 🎮`;
  
  return sendWhatsApp({ phone, message });
}

// Notify customer about cancellation
export async function notifyCustomerCancelled(phone: string, orderNumber: string): Promise<boolean> {
  const message = `❌ *PESANAN DIBATALKAN*\n\n` +
    `Order *${orderNumber}* telah dibatalkan karena pembayaran expired.\n\n` +
    `Jika Anda sudah melakukan pembayaran, silakan hubungi admin untuk proses refund.\n\n` +
    `ZOGAMING 🎮`;
  
  return sendWhatsApp({ phone, message });
}

// Notify customer about refund (30 min timeout)
export async function notifyCustomerRefund(phone: string, orderNumber: string): Promise<boolean> {
  const message = `💰 *REFUND DIPROSES*\n\n` +
    `Order *${orderNumber}* belum diproses dalam 30 menit.\n\n` +
    `Uang Anda akan dikembalikan. Mohon tunggu 1x24 jam untuk proses refund.\n\n` +
    `Kami mohon maaf atas ketidaknyamanannya.\n` +
    `ZOGAMING 🎮`;
  
  return sendWhatsApp({ phone, message });
}

// Notify customer order confirmation
export async function notifyCustomerOrderCreated(
  phone: string,
  orderNumber: string,
  productName: string,
  total: number
): Promise<boolean> {
  const message = `🛒 *PESANAN DIBUAT*\n\n` +
    `Halo! Pesanan Anda telah dibuat.\n\n` +
    `📋 Order: *${orderNumber}*\n` +
    `🎮 Produk: ${productName}\n` +
    `💰 Total: Rp ${total.toLocaleString('id-ID')}\n\n` +
    `⏳ Silakan lakukan pembayaran dalam 30 menit.\n\n` +
    `ZOGAMING 🎮`;

  return sendWhatsApp({ phone, message });
}
