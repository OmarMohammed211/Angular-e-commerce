// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home page[cite: 5]
  { 
    path: '', 
    loadComponent: () => import('./features/store/home/home').then(m => m.Home) 
  },
  // Products list[cite: 1]
  { 
    path: 'products', 
    loadComponent: () => import('./features/store/products/products').then(m => m.ProductsComponent) 
  },
  // Product Detail (the :id is the dynamic part)
  { 
    path: 'products/:id', 
    loadComponent: () => import('./features/store/product-detail/product-detail').then(m => m.ProductDetailComponent) 
  },
  // Cart page[cite: 7]
  { 
    path: 'cart', 
    loadComponent: () => import('./features/store/cart/cart').then(m => m.CartComponent) 
  },
  // Fallback (Optional: Redirect to home if path not found)
  { path: '**', redirectTo: '' }
];