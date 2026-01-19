<p align="center">
  <img src="https://res.cloudinary.com/drvgczmup/image/upload/v1762892241/tarkeba-logo_ptqtkv.jpg" width="150" alt="tarkeba-logo" />
</p>
<p align="center">Tarkeba is an e-commerce platform for selling perfumes 🛍️🌸</p>

# Tarkeba E-Commerce Platform - Frontend

Modern frontend application for Tarkeba perfume e-commerce platform. Built with Next.js 16, TypeScript, and Tailwind CSS with full Arabic RTL support. Features advanced state management with Redux Toolkit, comprehensive checkout flow, payment integration, and a complete admin dashboard.


## 🚀 Features implemented

### ✅ All Phases Completed + Code Quality Improvements

**Infrastructure & Auth** ✓
- Redux Toolkit + RTK Query with baseApi
- shadcn/ui Components with RTL Support
- Complete Arabic RTL Layout
- JWT Authentication with Refresh Tokens
- OAuth Integration (Google)
- Role-Based Redirects (Admin → Dashboard)

**Product Catalog** ✓
- Backend API Integration
- Products Listing with Advanced Filters
- Category-Based Filtering (by ID)
- Pagination with RTL Support
- Product Details with Variants
- Shopping Cart with Quantity Management
- Featured Products Display
- Compare Price Display

**Checkout & Payments** ✓
- Complete Checkout Flow
- Backend Integration (POST /orders/checkout)
- Payment Methods Selection (Wallet & COD)
- Wallet Phone Input (Paymob)
- Shipping Address Form (6 fields)
- Payment Success/Failure Pages
- Order Creation with Backend

**User Account** ✓
- Profile Management
- Order History
- Order Details
- Account Layout
- Personal Information Display

**Admin Dashboard** ✓
- Admin Authentication Guards
- Dashboard Structure
- Products Management Pages
- Orders Management Pages
- Categories Management Pages
- Users Management Pages
- Admin Sidebar Navigation

**Code Quality & Maintenance** ✓
- **Constants Centralization**: All Arabic text moved to organized constants
  - 7 constant files (labels, messages, buttons, titles, placeholders, navigation, status)
  - Type-safe and maintainable
  - Easy localization support
- Clean code structure
- Comprehensive component organization

## 🛠️ Tech Stack

- **Next.js 16** + TypeScript (with Turbopack)
- **Tailwind CSS 4** + shadcn/ui Components
- **Redux Toolkit** + RTK Query (API State Management)
- **React Hook Form** + Zod Validation
- **Cairo Arabic Font** (Full RTL Support)
- **Backend Integration**: NestJS API (localhost:5000/api)

## 📂 Project Structure

```
tarkeba-ecommerce-client/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, register, OTP)
│   ├── account/                  # User account pages
│   ├── admin/                    # Admin dashboard pages
│   ├── checkout/                 # Checkout flow
│   ├── payment/                  # Payment success/failure
│   ├── products/                 # Products listing & details
│   └── categories/               # Categories page
├── components/                   # React Components
│   ├── admin/                    # Admin-specific components
│   ├── auth/                     # Auth components
│   ├── Cart/                     # Shopping cart drawer
│   ├── layout/                   # Header, Footer, Hero
│   ├── products/                 # Product card, reviews
│   └── ui/                       # shadcn/ui components
├── constants/                    # Centralized constants
│   ├── buttons.ts                # Button texts
│   ├── labels.ts                 # Form labels
│   ├── messages.ts               # Success/error messages
│   ├── titles.ts                 # Page titles & descriptions
│   ├── placeholders.ts           # Input placeholders
│   ├── navigation.ts             # Menu items & links
│   └── status.ts                 # Status labels
├── features/                     # Redux slices & RTK Query
│   ├── api/                      # API endpoints
│   │   ├── authApi.ts           # Authentication
│   │   ├── productsApi.ts       # Products
│   │   ├── categoriesApi.ts     # Categories
│   │   ├── ordersApi.ts         # Orders & checkout
│   │   └── paymentsApi.ts       # Payment methods
│   ├── auth/                     # Auth slice
│   └── cart/                     # Cart slice
└── lib/                          # Utilities
    ├── store.ts                  # Redux store
    ├── hooks.ts                  # Custom hooks
    └── authStorage.ts            # Token management
```

## 🔑 Key Features Details

### Backend Integration
- Full REST API integration with NestJS backend
- JWT authentication with refresh token mechanism
- RTK Query for efficient data fetching and caching
- Automatic token refresh and error handling

### Checkout Flow
1. Shopping cart with quantity management
2. Shipping address form (customer name, address, city, state, phone)
3. Payment method selection (Wallet/Cash on Delivery)
4. Order creation with backend
5. Conditional redirect based on payment method

### Constants Architecture
All UI text centralized in `/constants` folder:
- **Easy Maintenance**: Update text in one place
- **Type-Safe**: Full TypeScript support
- **Localization Ready**: Prepared for multi-language support
- **Organized**: Grouped by category (labels, messages, buttons, etc.)

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:5000/api

## 🎯 Current Status

✅ **Production Ready**: All core features implemented  
✅ **Code Quality**: Clean, maintainable, and well-organized  
✅ **Backend Integrated**: Full API connectivity  
✅ **Constants Centralized**: Easy text management  
✅ **RTL Support**: Complete Arabic language support

## 📝 Recent Updates (January 2026)

- ✨ Constants centralization completed
- 🔧 Backend API integration for products, categories, and orders
- 🛒 Complete checkout flow with payment methods
- 📱 Pagination with RTL support
- 🎨 Compare price display in product cards
- 🔐 Enhanced authentication with role-based routing
- 📦 Admin redirect to dashboard for admin users

See full documentation and API details in project files.

