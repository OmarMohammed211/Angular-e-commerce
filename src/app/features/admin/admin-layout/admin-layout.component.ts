import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      <!-- Sidebar -->
      <aside class="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col transition-all duration-300">
        <!-- Brand -->
        <div class="h-20 flex items-center px-6 border-b border-slate-800">
          <a routerLink="/" class="text-white font-bold text-xl tracking-wider flex items-center gap-2 hover:text-white">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
              </svg>
            </div>
            ADMIN PORTAL
          </a>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          
          <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Overview</p>
          
          <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-white group-[.active]:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </a>

          <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8">Management</p>

          <a routerLink="/admin/products" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </a>
          
          <a routerLink="/admin/categories" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Categories
          </a>

          
          <a routerLink="/admin/orders" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </a>

        </nav>

        <!-- User section -->
        <div class="p-4 border-t border-slate-800">
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
              {{ auth.user()?.name?.charAt(0) || 'A' }}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-sm font-medium text-white truncate">{{ auth.user()?.name || 'Administrator' }}</p>
              <p class="text-xs text-slate-500 truncate">{{ auth.user()?.email || 'admin@store.com' }}</p>
            </div>
          </div>
          <button (click)="logout()" class="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- Topbar -->
        <header class="min-h-20 bg-white border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 lg:py-0 z-10">
          <div class="flex items-center justify-between gap-4 w-full lg:w-auto">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800">Back Office</h2>
            <a routerLink="/" class="lg:hidden text-xs font-bold uppercase tracking-wider text-blue-600">Storefront</a>
          </div>
          <nav class="lg:hidden flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 text-sm">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-600 text-white" class="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-gray-700">Dashboard</a>
            <a routerLink="/admin/products" routerLinkActive="bg-blue-600 text-white" class="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-gray-700">Products</a>
            <a routerLink="/admin/categories" routerLinkActive="bg-blue-600 text-white" class="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-gray-700">Categories</a>
            <a routerLink="/admin/orders" routerLinkActive="bg-blue-600 text-white" class="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-gray-700">Orders</a>
          </nav>
          <div class="flex items-center gap-4">
            <button class="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <router-outlet></router-outlet>
        </div>
      </main>

    </div>
  `
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
