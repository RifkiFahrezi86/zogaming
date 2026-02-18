# Panduan Mengganti Gambar dan Nama

Panduan ini menjelaskan cara mengganti gambar dan nama konten di LUGX Gaming.

---

## 1. Menambah Gambar Baru

### Langkah-langkah:
1. Siapkan file gambar (format: `.jpg`, `.png`, atau `.webp`)
2. Copy file gambar ke folder:
   ```
   lugx-gaming-nextjs/public/images/
   ```
3. Gunakan path `/images/nama-file.jpg` saat menambah produk di admin

### Contoh Path Gambar:
| File | Path untuk Admin |
|------|------------------|
| `game-baru.jpg` | `/images/game-baru.jpg` |
| `kategori-baru.png` | `/images/kategori-baru.png` |

---

## 2. Menambah/Edit Produk (Game)

### Via Admin Dashboard:
1. Buka http://localhost:3000/admin/products
2. Klik **"Add Product"**
3. Isi form:
   - **Name**: Nama game
   - **Category**: Pilih kategori
   - **Price**: Harga normal
   - **Sale Price**: Harga diskon (opsional)
   - **Image URL**: Path gambar (contoh: `/images/game-baru.jpg`)
   - **Description**: Deskripsi game
   - **Tags**: Tag dipisah koma (contoh: `Action, RPG`)
   - **Trending**: Centang jika ingin tampil di Home
4. Klik **"Add Product"**

> ✅ Game otomatis muncul di Shop dan Home (jika trending)

### Edit Produk:
1. Klik ikon pensil (✏️) di tabel produk
2. Ubah data yang diperlukan
3. Klik **"Update Product"**

---

## 3. Menambah/Edit Kategori

### Via Admin Dashboard:
1. Buka http://localhost:3000/admin/categories
2. Klik **"Add Category"**
3. Isi form:
   - **Name**: Nama kategori
   - **Image URL**: Path gambar kategori
   - **Description**: Deskripsi kategori
4. Klik **"Add Category"**

---

## 4. Mengganti Logo/Banner

### Logo:
1. Ganti file `lugx-gaming-nextjs/public/images/logo.png`
2. Pastikan nama file sama: `logo.png`

### Banner Home:
1. Ganti file di `public/images/`:
   - `banner-bg.jpg` - Background hero
   - `banner-image.jpg` - Gambar featured game

### Banner Halaman:
1. Ganti file `public/images/page-heading-bg.jpg`

---

## 5. Mengubah Informasi Kontak

1. Buka http://localhost:3000/admin/settings
2. Edit:
   - **Site Name**: Nama website
   - **Address**: Alamat
   - **Phone**: Nomor telepon
   - **Email**: Email kontak
   - **Social Links**: Link media sosial
3. Klik **"Save Settings"**

---

## Tips

| Kebutuhan | Ukuran Gambar yang Disarankan |
|-----------|-------------------------------|
| Produk/Game | 300 x 400 px |
| Kategori | 250 x 300 px |
| Banner | 1920 x 800 px |
| Banner atas / page heading | 1600 × 420 px|
| Banner bawah / page heading | 1600 × 150 px |
| Logo | 150 x 50 px |

> 💡 Semua perubahan tersimpan otomatis di browser (localStorage)
