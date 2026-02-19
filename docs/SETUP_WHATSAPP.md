# Panduan Setup WhatsApp Notification - ZOGAMING

## Kenapa Pesan WA Tidak Masuk?

Karena `FONNTE_API_TOKEN` di file `.env` masih **placeholder** (`your-fonnte-api-token`).
Sistem ZOGAMING menggunakan **Fonnte.com** sebagai API WhatsApp.
Tanpa token yang valid, pesan TIDAK AKAN TERKIRIM.

---

## Langkah-Langkah Setup (5 Menit)

### STEP 1: Daftar di Fonnte.com

1. Buka browser → kunjungi **[https://fonnte.com](https://fonnte.com)**
2. Klik **"Daftar"** atau **"Register"**
3. Isi data:
   - Nama
   - Email
   - Password
4. Verifikasi email (cek inbox/spam)
5. Login ke dashboard Fonnte

### STEP 2: Hubungkan Nomor WhatsApp

1. Di dashboard Fonnte, klik **"Add Device"** atau **"Tambah Device"**
2. Masukkan **nomor WhatsApp ADMIN** yang akan mengirim pesan
   - Contoh: `085954092060`
   - Nomor ini yang akan mengirim notifikasi ke customer dan menerima notif order
3. Klik **"Connect"**
4. Akan muncul **QR Code**
5. Buka **WhatsApp** di HP kamu:
   - Android: Titik tiga (⋮) → **Linked Devices** → **Link a Device**
   - iPhone: **Settings** → **Linked Devices** → **Link a Device**
6. Scan QR Code yang muncul di Fonnte
7. Tunggu sampai status berubah menjadi **"Connected"** ✅

> ⚠️ **PENTING**: Jangan logout dari WhatsApp Web/Fonnte, karena koneksi akan terputus!

### STEP 3: Copy API Token

1. Di dashboard Fonnte, klik device yang sudah connected
2. Cari bagian **"Token"** atau **"API Key"**
3. **Copy** token tersebut (contoh: `JxK7#gH2mNp!qR9s...`)

### STEP 4: Pasang Token di Project

#### A. Untuk Development (Lokal)

1. Buka file `.env` di root project
2. Ganti baris:
   ```
   FONNTE_API_TOKEN="your-fonnte-api-token"
   ```
   Menjadi:
   ```
   FONNTE_API_TOKEN="TOKEN_KAMU_DARI_FONNTE"
   ```
3. Pastikan juga nomor admin benar:
   ```
   ADMIN_WHATSAPP="6285954092060"
   ```
   > Format: **62** + nomor tanpa 0 di depan (6285xxx, bukan 085xxx)

4. Restart dev server:
   ```bash
   npm run dev
   ```

#### B. Untuk Production (Vercel)

1. Buka **[vercel.com](https://vercel.com)** → Login
2. Pilih project **ZOGAMING**
3. Klik **Settings** → **Environment Variables**
4. Tambah/Update variable:

   | Key | Value |
   |-----|-------|
   | `FONNTE_API_TOKEN` | `TOKEN_KAMU_DARI_FONNTE` |
   | `ADMIN_WHATSAPP` | `6285954092060` |

5. Klik **Save**
6. **Redeploy** project (Deployments → klik ⋯ → Redeploy)

### STEP 5: Test Kirim Pesan

#### Test Manual via Terminal:
```bash
curl -X POST https://api.fonnte.com/send \
  -H "Authorization: TOKEN_KAMU_DARI_FONNTE" \
  -H "Content-Type: application/json" \
  -d '{"target": "6285954092060", "message": "Test ZOGAMING notification!", "countryCode": "62"}'
```

#### Test via Website:
1. Buka `http://localhost:3000/shop`
2. Pilih produk → Klik **Buy Now**
3. Isi nama dan nomor WhatsApp
4. Klik **Checkout**
5. Cek WhatsApp admin — harusnya ada pesan:
   ```
   🛒 PESANAN BARU MASUK!
   Order: ORD-004
   👤 Nama: Test Customer
   📱 WhatsApp: 628xxxxxxxxx
   🎮 Produk: God of War Ragnarok
   💰 Total: Rp 149.000
   ```

---

## Kapan Admin Terima WA?

| Event | Admin Terima WA? | Isi Pesan |
|-------|:-:|-----------|
| Customer buat pesanan | ✅ | 🛒 Pesanan baru masuk + detail |
| Customer konfirmasi bayar | ✅ | 💳 Customer sudah bayar, segera verifikasi |
| Admin verifikasi payment | ✅ | ✅ Pembayaran diverifikasi |

## Kapan Customer Terima WA?

| Event | Customer Terima WA? | Isi Pesan |
|-------|:-:|-----------|
| Order dibuat | ✅ | 🛒 Pesanan dibuat, silakan bayar |
| Payment diverifikasi | ✅ | ✅ Pembayaran diterima, sedang diproses |
| Akun game dikirim | ✅ | 🎮 Detail akun (email + password) |
| Order dibatalkan | ✅ | ❌ Pesanan dibatalkan |
| Order expired | ✅ | ❌ Timeout, info refund |

---

## Troubleshooting

### "Token not configured" di log server
→ Token masih placeholder. Ganti dengan token asli dari Fonnte.

### WA tidak terkirim tapi sudah pakai token
1. Cek apakah device di Fonnte masih **Connected**
2. Cek saldo/kuota Fonnte (free tier: 1000 pesan/bulan)
3. Cek format nomor: harus `62xxxxxxxx` (bukan `0xxx` atau `+62xxx`)
4. Cek log di Vercel: **Deployments** → **Functions** → cari error

### Device terputus (Disconnected)
1. Buka dashboard Fonnte
2. Klik **Reconnect** pada device
3. Scan ulang QR Code dari WhatsApp HP

### Kuota habis
- Free: 1000 pesan/bulan
- Upgrade ke plan berbayar di Fonnte jika butuh lebih

---

## Harga Fonnte (Per Februari 2026)

| Plan | Harga | Kuota |
|------|-------|-------|
| Free | Rp 0 | 1.000 pesan/bulan |
| Starter | ~Rp 50.000/bulan | 5.000 pesan/bulan |
| Pro | ~Rp 100.000/bulan | 20.000 pesan/bulan |

> Cek harga terbaru di [fonnte.com/pricing](https://fonnte.com/pricing)

---

## Ringkasan: Yang Harus Dilakukan

```
1. Daftar fonnte.com
2. Connect WhatsApp (scan QR)
3. Copy API Token
4. Paste ke .env → FONNTE_API_TOKEN="token_kamu"
5. Paste ke Vercel → Environment Variables
6. Redeploy
7. Test order → cek WA admin
```

---

## Alternatif Jika Tidak Mau Pakai Fonnte

| Service | Website | Harga |
|---------|---------|-------|
| **Fonnte** | fonnte.com | Gratis 1000 pesan/bulan |
| **Wablas** | wablas.com | Mulai Rp 50rb/bulan |
| **Woowa** | woowa.id | Mulai Rp 75rb/bulan |
| **WhatsApp Business API (Official)** | business.whatsapp.com | Bayar per pesan |

Jika mau ganti provider, cukup ubah fungsi `sendWhatsApp()` di file `src/lib/whatsapp.ts`.

---

*Panduan ini dibuat untuk ZOGAMING Backend System*
