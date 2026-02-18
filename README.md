# LUGX Gaming - Next.js Application

A modern gaming shop e-commerce frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎮 Features

### Public Site
- **Home Page** - Hero banner, features, trending games, categories, newsletter
- **Shop Page** - Product grid with category filters and pagination
- **Product Details** - Full product info, reviews, related items
- **Contact Page** - Contact form with Google Maps integration

### Admin Dashboard
- **Dashboard** - Stats overview, recent orders, quick actions
- **Products** - Full CRUD with search/filter
- **Categories** - Grid view with product counts
- **Orders** - Status management and order details
- **Settings** - Site configuration

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── shop/               # Shop page
│   ├── products/[id]/      # Product details
│   └── contact/            # Contact page
├── components/
│   ├── layout/             # Header, Footer
│   └── ui/                 # ProductCard, CategoryCard, Preloader
├── data/                   # Mock JSON data
└── lib/                    # Types, DataContext
```

## 💾 Data Persistence

All data is stored in localStorage. Changes made in the admin dashboard persist across browser sessions.

## 🎨 Design

- **Public Site**: Blue (#0071f8) and pink (#ee626b) accent colors
- **Admin Dashboard**: Dark navy theme with gradient accents

## 📝 License

Based on TemplateMo 589 LUGX Gaming template.
