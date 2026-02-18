# Admin Dashboard Guide

## Accessing the Dashboard

Navigate to `/admin` to access the dashboard. The admin panel features a dark theme for comfortable extended use.

## Dashboard Overview

The main dashboard shows:
- **Stats Cards** - Total products, categories, orders, and revenue
- **Recent Orders** - Latest 5 orders with status
- **Quick Actions** - Fast access to common tasks

## Managing Products

### View Products
Navigate to `/admin/products` to see all products in a searchable table.

### Add a Product
1. Click "Add Product" button
2. Fill in the form:
   - **Name**: Product title
   - **Category**: Select from existing categories
   - **Price**: Original price
   - **Sale Price**: Optional discounted price
   - **Image URL**: Path like `/images/trending-01.jpg`
   - **Description**: Product details
   - **Tags**: Comma-separated (e.g., "Action, RPG, Adventure")
   - **Featured/Trending**: Toggle visibility on home page
3. Click "Add Product"

### Edit/Delete Products
- Click the pencil icon to edit
- Click the trash icon to delete (with confirmation)

## Managing Categories

Navigate to `/admin/categories` to view categories as cards showing product counts.

Add/edit categories similarly to products.

## Managing Orders

Navigate to `/admin/orders` to see all orders. Use status filters to find specific orders.

### Update Order Status
1. Click the eye icon to view order details
2. Click status buttons to update: Pending → Processing → Completed

## Settings

Navigate to `/admin/settings` to configure:
- **Site Name & Logo**
- **Contact Information** (Address, Phone, Email)
- **Social Media Links**

Changes are saved to localStorage and persist across sessions.

## Data Persistence

All data is stored in your browser's localStorage. To reset to defaults, clear localStorage or use browser DevTools.
