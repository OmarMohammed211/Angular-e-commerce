import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { 
        path: '', 
        title: 'ELEVARE | Future of Wellness',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
      },
      { 
        path: 'products', 
        title: 'The Collection | ELEVARE',
        loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) 
      },
      { 
        path: 'products/:id', 
        title: 'Product Detail | ELEVARE',
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent) 
      },
      { 
        path: 'cart', 
        title: 'Shopping Bag | ELEVARE',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) 
      },
      { 
        path: 'checkout', 
        title: 'Secure Checkout | ELEVARE',
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) 
      },
      { 
        path: 'order-history', 
        title: 'Order History | ELEVARE',
        loadComponent: () => import('./features/order-history/order-history.component').then(m => m.OrderHistoryComponent) 
      },
      {
        path: 'auth',
        children: [
          { 
            path: 'login', 
            title: 'Sign In | ELEVARE',
            loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
          },
          { 
            path: 'register', 
            title: 'Create Account | ELEVARE',
            loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    title: 'Admin Portal | ELEVARE',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        title: 'Dashboard | ELEVARE Admin',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'products', 
        title: 'Manage Products | ELEVARE Admin',
        loadComponent: () => import('./features/admin/products/product-manager.component').then(m => m.ProductManagerComponent) 
      },
      { 
        path: 'categories', 
        title: 'Manage Categories | ELEVARE Admin',
        loadComponent: () => import('./features/admin/categories/category-manager.component').then(m => m.CategoryManagerComponent) 
      },
      { 
        path: 'orders', 
        title: 'Manage Orders | ELEVARE Admin',
        loadComponent: () => import('./features/admin/orders/order-manager.component').then(m => m.OrderManagerComponent) 
      }

    ]
  }
];
