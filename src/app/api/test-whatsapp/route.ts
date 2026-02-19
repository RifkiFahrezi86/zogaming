import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsApp, getAdminPhone } from '@/lib/whatsapp';

// Test endpoint untuk kirim WhatsApp
// GET /api/test-whatsapp?phone=6285954092060
// Jika phone tidak diisi, akan kirim ke ADMIN_WHATSAPP
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone') || getAdminPhone();
    
    const message = `✅ *TEST WHATSAPP ZOGAMING*\n\n` +
      `Jika Anda menerima pesan ini, berarti:\n` +
      `✅ Fonnte API Token sudah benar\n` +
      `✅ WhatsApp device sudah terkoneksi\n` +
      `✅ Notifikasi WA sudah berjalan\n\n` +
      `Waktu test: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n` +
      `ZOGAMING 🎮`;

    console.log('[Test WA] Sending test message to:', phone);
    const result = await sendWhatsApp({ phone, message });

    return NextResponse.json({
      success: result,
      phone,
      token_configured: !!process.env.FONNTE_API_TOKEN && process.env.FONNTE_API_TOKEN !== 'your-fonnte-api-token',
      admin_phone: getAdminPhone(),
      message: result 
        ? 'Pesan WhatsApp berhasil dikirim! Cek HP Anda.' 
        : 'Gagal kirim WhatsApp. Pastikan: 1) Token benar (Device Token, bukan Account Token), 2) Device sudah terkoneksi di fonnte.com, 3) Nomor WhatsApp aktif.',
    });
  } catch (error) {
    console.error('[Test WA] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
