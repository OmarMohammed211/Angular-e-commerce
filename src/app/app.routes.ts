import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { 
        path: 'categories', 
        loadComponent: () => import('./admin/categories/category-manager.component').then(m => m.CategoryManagerComponent) 
      },
      { 
        path: 'products', 
        loadComponent: () => import('./admin/products/product-manager.component').then(m => m.ProductManagerComponent) 
      }
    ]
  }
];
