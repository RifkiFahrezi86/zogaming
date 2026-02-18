# Flow Aplikasi LUGX Gaming

## Alur Sistem

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LUGX GAMING FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│  ADMIN PANEL     │────▶│   DATA CONTEXT   │────▶│   PUBLIC SITE    │
│  /admin/*        │     │   (React State)  │     │   /, /shop, etc  │
│                  │     │                  │     │                  │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   localStorage   │
                         │   (Persistence)  │
                         └──────────────────┘
```

---

## Flow Tambah Game Baru

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: Admin menambah game baru                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Admin]  ──▶  /admin/products  ──▶  Klik "Add Product"            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: Isi form dan submit                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Form: Name, Category, Price, Image, Description, Tags              │
│                                                                     │
│  ──▶  Klik "Add Product"                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: DataContext memproses data                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  addProduct() {                                                     │
│    1. Buat ID unik                                                  │
│    2. Tambah ke array products                                      │
│    3. Simpan ke localStorage                                        │
│    4. Update state (trigger re-render)                              │
│  }                                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: Public site otomatis terupdate                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   HOME      │  │    SHOP     │  │  PRODUCT    │                 │
│  │  /          │  │   /shop     │  │  DETAILS    │                 │
│  │             │  │             │  │  /products/ │                 │
│  │ ✓ Trending  │  │ ✓ Product   │  │  [id]       │                 │
│  │   Section   │  │   Grid      │  │             │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                     │
│  Semua komponen menggunakan useData() sehingga                     │
│  otomatis mendapat data terbaru                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  Admin   │
     │  Panel   │
     └────┬─────┘
          │
          │ addProduct() / updateProduct() / deleteProduct()
          ▼
     ┌──────────────────────────────────────────┐
     │           DataContext                    │
     │  ┌────────────────────────────────────┐  │
     │  │  products: [...]                   │  │
     │  │  categories: [...]                 │  │
     │  │  orders: [...]                     │  │
     │  │  settings: {...}                   │  │
     │  └────────────────────────────────────┘  │
     │                                          │
     │  CRUD Functions:                         │
     │  • addProduct()                          │
     │  • updateProduct()                       │
     │  • deleteProduct()                       │
     │  • addCategory()                         │
     │  • updateCategory()                      │
     │  • deleteCategory()                      │
     │  • updateOrderStatus()                   │
     │  • updateSettings()                      │
     └────────────────┬─────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     ┌──────────┐           ┌────────────┐
     │  Public  │           │ localStorage│
     │  Site    │           │            │
     │          │           │ lugx_      │
     │ • Home   │           │  products  │
     │ • Shop   │           │ lugx_      │
     │ • Detail │           │  categories│
     │ • Contact│           │ lugx_      │
     │          │           │  orders    │
     └──────────┘           │ lugx_      │
                            │  settings  │
                            └────────────┘
```

---

## Komponen dan Halaman

```
┌─────────────────────────────────────────────────────────────────────┐
│                      STRUKTUR KOMPONEN                              │
└─────────────────────────────────────────────────────────────────────┘

RootLayout
    │
    ├── DataProvider (wraps everything)
    │       │
    │       ├── PUBLIC PAGES
    │       │       │
    │       │       ├── / (Home)
    │       │       │     ├── Header
    │       │       │     ├── Hero Banner
    │       │       │     ├── Features (4 cards)
    │       │       │     ├── Trending Games ← useData().products
    │       │       │     ├── Most Played ← useData().products
    │       │       │     ├── Categories ← useData().categories
    │       │       │     ├── CTA Section
    │       │       │     └── Footer
    │       │       │
    │       │       ├── /shop
    │       │       │     ├── Header
    │       │       │     ├── Category Filter ← useData().categories
    │       │       │     ├── Product Grid ← useData().products
    │       │       │     ├── Pagination
    │       │       │     └── Footer
    │       │       │
    │       │       ├── /products/[id]
    │       │       │     ├── Header
    │       │       │     ├── Product Detail ← useData().products
    │       │       │     ├── Description/Reviews Tabs
    │       │       │     ├── Related Products
    │       │       │     └── Footer
    │       │       │
    │       │       └── /contact
    │       │             ├── Header
    │       │             ├── Contact Info ← useData().settings
    │       │             ├── Google Maps
    │       │             ├── Contact Form
    │       │             └── Footer
    │       │
    │       └── ADMIN PAGES (AdminLayout)
    │               │
    │               ├── Sidebar Navigation
    │               ├── Top Bar
    │               │
    │               ├── /admin (Dashboard)
    │               │     ├── Stats Cards
    │               │     ├── Recent Orders
    │               │     └── Quick Actions
    │               │
    │               ├── /admin/products
    │               │     ├── Search/Filter
    │               │     ├── Products Table
    │               │     └── Add/Edit Modal
    │               │
    │               ├── /admin/categories
    │               │     ├── Categories Grid
    │               │     └── Add/Edit Modal
    │               │
    │               ├── /admin/orders
    │               │     ├── Status Filter
    │               │     ├── Orders Table
    │               │     └── Order Detail Modal
    │               │
    │               └── /admin/settings
    │                     ├── General Settings
    │                     ├── Contact Info
    │                     └── Social Links
    │
    └── End
```

---

## Ringkasan

| Aksi di Admin | Efek di Public Site |
|---------------|---------------------|
| Tambah Produk | Muncul di Shop, Home (jika trending) |
| Edit Produk | Data terupdate di semua halaman |
| Hapus Produk | Hilang dari semua halaman |
| Tambah Kategori | Muncul di filter Shop & Home |
| Edit Settings | Contact info terupdate |
