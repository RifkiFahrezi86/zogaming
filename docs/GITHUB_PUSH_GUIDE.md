# 🚀 Panduan Push Project ke GitHub

## 📋 Prasyarat

- [x] **Git** sudah terinstall (`git --version`)
- [x] **Akun GitHub** — [github.com](https://github.com)
- [x] **Git config** sudah diset (username & email)

```bash
git config --global user.name "RifkiFahrezi86"
git config --global user.email "rifkifka@email.com"
```

---

## 🔧 Langkah-Langkah Push ke GitHub

### 1. Buat Repository Baru di GitHub

1. Buka [github.com/new](https://github.com/new)
2. Isi **Repository name**: `lugx-gaming-nextjs`
3. Pilih **Public** atau **Private**
4. **JANGAN** centang "Add a README file" (kita sudah punya)
5. Klik **Create repository**

### 2. Inisialisasi Git (Sudah Done ✅)

```bash
# Masuk ke folder project
cd "d:\WEB PROJECT\PROJECT\templatemo_589_lugx_gaming\lugx-gaming-nextjs"

# Cek status git
git status
```

> Project ini sudah memiliki git init dengan branch `master`.

### 3. Tambahkan Semua File

```bash
# Stage semua file
git add .

# Cek file yang akan di-commit
git status
```

### 4. Commit

```bash
git commit -m "feat: ZOGAMING - Next.js gaming website with admin panel"
```

### 5. Hubungkan ke GitHub Remote

```bash
# Tambah remote origin (ganti URL sesuai repo kamu)
git remote add origin https://github.com/RifkiFahrezi86/lugx-gaming-nextjs.git
```

### 6. Rename Branch ke `main` (Standar GitHub)

```bash
git branch -M main
```

### 7. Push ke GitHub

```bash
git push -u origin main
```

> Jika diminta login, masukkan **username** dan **Personal Access Token** (bukan password).

---

## 🔑 Cara Buat Personal Access Token (PAT)

Jika belum punya token:

1. Buka [github.com/settings/tokens](https://github.com/settings/tokens)
2. Klik **Generate new token (classic)**
3. Beri nama, misal: `laptop-token`
4. Centang scope: **repo** (full control)
5. Klik **Generate token**
6. **Salin token** — ini yang dipakai sebagai password saat push

---

## 📁 Struktur yang Di-push

```
lugx-gaming-nextjs/
├── docs/                  # Dokumentasi
├── public/images/         # Asset gambar
├── src/
│   ├── app/              # Pages & layouts
│   │   ├── admin/        # Admin panel
│   │   ├── contact/      # Contact page
│   │   ├── products/     # Product detail
│   │   └── shop/         # Shop page
│   ├── components/       # Reusable components
│   ├── data/             # JSON data files
│   └── lib/              # Context & types
├── .gitignore
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🔄 Update Berikutnya (Setelah Push Pertama)

Setiap kali ada perubahan baru:

```bash
# 1. Cek perubahan
git status

# 2. Stage perubahan
git add .

# 3. Commit dengan pesan deskriptif
git commit -m "fix: deskripsi perubahan"

# 4. Push ke GitHub
git push
```

---

## ⚠️ File yang Tidak Di-push (via .gitignore)

| Folder/File | Alasan |
|-------------|--------|
| `node_modules/` | Dependencies, install via `npm install` |
| `.next/` | Build output Next.js |
| `.env*` | Environment variables (rahasia) |
| `.vercel/` | Config Vercel lokal |

---

## 🛠️ Troubleshooting

### Error: remote origin already exists
```bash
git remote remove origin
git remote add origin https://github.com/RifkiFahrezi86/lugx-gaming-nextjs.git
```

### Error: Permission denied
- Pastikan menggunakan **Personal Access Token** bukan password
- Atau setup SSH key: [docs.github.com/authentication](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

### Error: failed to push (rejected)
```bash
git pull origin main --rebase
git push -u origin main
```
