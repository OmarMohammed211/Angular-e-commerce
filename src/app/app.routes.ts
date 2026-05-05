import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then(m => m.Cart),
    title: 'Shopping Cart'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout),
    title: 'Checkout'
  },
];
