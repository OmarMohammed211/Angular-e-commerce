# 🛒 Angular E-Commerce

A modern, fully-featured e-commerce web application built with Angular 19, leveraging standalone components, signals, and lazy loading.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 19 |
| Language | TypeScript |
| Styling | SCSS |
| State | Angular Signals |
| HTTP | HttpClient |
| Routing | Angular Router (lazy-loaded) |
| API | [DummyJSON](https://dummyjson.com) |

---

## ✨ Features

- 🏠 **Home Page** — Hero section, featured products, category highlights
- 🛍️ **Products Listing** — Filter by category, search, pagination
- 🔍 **Product Detail** — Images, description, rating, add to cart
- 🛒 **Shopping Cart** — Add/remove/update items, persisted in localStorage
- 💳 **Checkout** — Shipping address form, order summary
- 📦 **Orders History** — View past orders and statuses
- 🔐 **Auth** — Login & Register with route guards
- 📱 **Responsive** — Mobile-first design

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces (Product, Cart, User, Order)
│   │   ├── services/        # ProductService, AuthService, CartService, OrderService
│   │   ├── guards/          # authGuard, guestGuard
│   │   └── interceptors/    # authInterceptor (JWT)
│   ├── shared/
│   │   ├── components/      # Navbar, Footer, ProductCard, Pagination, SearchBar
│   │   ├── directives/      # Custom directives
│   │   └── pipes/           # Custom pipes
│   ├── features/
│   │   ├── home/
│   │   ├── products/
│   │   ├── product-detail/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   ├── app.routes.ts        # Lazy-loaded routes
│   ├── app.config.ts        # App providers
│   └── app.component.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.scss
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Angular CLI >= 19

### Installation

```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Clone the repository
git clone https://github.com/YOUR_USERNAME/ng-ecommerce.git
cd ng-ecommerce

# Install dependencies
npm install

# Start the dev server
ng serve
```

Open your browser at **http://localhost:4200**

---

## 📜 Available Scripts

```bash
ng serve          # Start dev server
ng build          # Production build → dist/
ng build --watch  # Watch mode
ng test           # Run unit tests
ng generate component shared/components/my-component  # Generate a component
```

---

## 🌐 Environment Configuration

Edit `src/environments/environment.ts` to change the API base URL:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://dummyjson.com',
};
```

---

## 🔐 Authentication

The app uses JWT-based auth via [DummyJSON /auth/login](https://dummyjson.com/docs/auth).

**Demo credentials:**
```
username: emilys
password: emilyspass
```

The `authInterceptor` automatically attaches the token to every outgoing request.

---

## 🗺️ Routes

| Path | Component | Guard |
|------|-----------|-------|
| `/` | HomeComponent | — |
| `/products` | ProductsComponent | — |
| `/products/:id` | ProductDetailComponent | — |
| `/cart` | CartComponent | — |
| `/checkout` | CheckoutComponent | `authGuard` |
| `/orders` | OrdersComponent | `authGuard` |
| `/auth/login` | LoginComponent | `guestGuard` |
| `/auth/register` | RegisterComponent | `guestGuard` |

---

## 📦 Production Build

```bash
ng build
```

Output is in `dist/ng-ecommerce/`. Deploy to any static hosting (Netlify, Vercel, Firebase Hosting, etc.).

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License © 2025