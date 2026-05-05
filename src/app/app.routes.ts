import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
    title: 'Home'
  },
  {
    path: 'orders',
    // Hook in your auth logic here:
    // canActivate: [authGuard],
    loadComponent: () => import('./features/orders/orders').then(m => m.Orders),
    title: 'My Orders'
  },
  // Fallback route
  {
    path: '**',
    redirectTo: ''
  }
];