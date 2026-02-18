# API Structure

This document describes the data models and mock API structure for future backend integration.

## Data Models

### Product

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;        // Category slug
  price: number;
  salePrice: number | null;
  image: string;           // URL path
  description: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}
```

### Order

```typescript
interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;  // ISO 8601
}
```

### Site Settings

```typescript
interface SiteSettings {
  siteName: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}
```

## Backend Integration

To connect a real backend, replace the DataContext with API calls:

```typescript
// Example: Replace localStorage with API
const fetchProducts = async () => {
  const res = await fetch('/api/products');
  return res.json();
};

const addProduct = async (product: Omit<Product, 'id'>) => {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return res.json();
};
```

## Suggested API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/categories | List all categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |
| GET | /api/orders | List all orders |
| PUT | /api/orders/:id/status | Update order status |
| GET | /api/settings | Get settings |
| PUT | /api/settings | Update settings |
