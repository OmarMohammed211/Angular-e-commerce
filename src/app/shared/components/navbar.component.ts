import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Header -->
    <header class="bg-white sticky top-0 z-50">
      
      <!-- Announcement Bar -->
      <div class="bg-[#5c5c56] text-white py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-center hidden md:block">
        Free Delivery Across Egypt • Exclusive Brands • Scheduled Delivery
      </div>

      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div class="flex justify-between items-center h-20 lg:h-24">
          
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a routerLink="/" class="flex flex-col items-center group">
              <span class="text-xl sm:text-2xl font-serif text-[#3a3a35] tracking-[0.28em] sm:tracking-[0.4em] uppercase leading-none">ELEVARE</span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#3a3a35] mt-1.5 -ml-1"></span>
            </a>
          </div>

          <!-- Search Bar -->
          <div class="hidden md:flex flex-1 max-w-xl mx-8 xl:mx-16 relative group">
            <input 
              type="text" 
              placeholder="Search" 
              class="w-full bg-white border border-[#e5e2dd] rounded-full px-8 py-3.5 text-sm text-[#3a3a35] font-light placeholder-[#8c8c88] focus:outline-none focus:border-[#3a3a35] transition-all">
            <button class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fbf9f6] rounded-full flex items-center justify-center text-[#8c8c88] hover:text-[#3a3a35] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-3 sm:gap-5 lg:gap-10">
            <div class="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#3a3a35]">
              <a routerLink="/about" class="hover:opacity-60 transition-opacity">About</a>
              <a href="#" class="hover:opacity-60 transition-opacity">العربية</a>
            </div>
            
            <div class="flex items-center gap-3 sm:gap-5">
              <!-- Wishlist -->
              <a routerLink="/wishlist" class="hidden sm:block text-[#3a3a35] hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </a>
              
              <!-- User Icon / Profile Dropdown -->
              <div class="relative">
                <button (click)="toggleUserMenu()" class="text-[#3a3a35] hover:opacity-60 transition-opacity flex items-center gap-2">
                  <!-- Guest: outline icon -->
                  <svg *ngIf="!auth.isAuthenticated()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <!-- Logged in: avatar circle -->
                  <div *ngIf="auth.isAuthenticated()" class="w-8 h-8 rounded-full bg-[#3a3a35] flex items-center justify-center text-white text-xs font-bold uppercase">
                    {{ auth.user()?.name?.charAt(0) }}
                  </div>
                </button>

                <!-- Dropdown Menu -->
                <div *ngIf="isUserMenuOpen()" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden" style="z-index: 100;">
                  
                  <!-- Logged In State -->
                  <ng-container *ngIf="auth.isAuthenticated()">
                    <div class="px-5 py-4 border-b border-gray-50">
                      <p class="text-sm font-semibold text-[#3a3a35]">{{ auth.user()?.name }}</p>
                      <p class="text-[11px] text-[#8c8c88] mt-0.5">{{ auth.user()?.email }}</p>
                    </div>
                    
                    <a routerLink="/order-history" (click)="closeUserMenu()" class="flex items-center gap-3 px-5 py-3 text-sm text-[#3a3a35] hover:bg-[#fbf9f6] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#8c8c88]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Order History
                    </a>

                    <a *ngIf="auth.isAdmin()" routerLink="/admin" (click)="closeUserMenu()" class="flex items-center gap-3 px-5 py-3 text-sm text-[#3a3a35] hover:bg-[#fbf9f6] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#8c8c88]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Admin Dashboard
                    </a>

                    <div class="border-t border-gray-50 mt-1">
                      <button (click)="onLogout()" class="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </ng-container>

                  <!-- Logged Out State -->
                  <ng-container *ngIf="!auth.isAuthenticated()">
                    <div class="px-5 py-4 border-b border-gray-50">
                      <p class="text-sm font-semibold text-[#3a3a35]">Welcome</p>
                      <p class="text-[11px] text-[#8c8c88] mt-0.5">Sign in to access your account.</p>
                    </div>
                    <a routerLink="/auth/login" (click)="closeUserMenu()" class="flex items-center gap-3 px-5 py-3 text-sm text-[#3a3a35] hover:bg-[#fbf9f6] transition-colors font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#8c8c88]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                      Sign In
                    </a>
                    <a routerLink="/auth/register" (click)="closeUserMenu()" class="flex items-center gap-3 px-5 py-3 text-sm text-[#3a3a35] hover:bg-[#fbf9f6] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#8c8c88]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      Create Account
                    </a>
                  </ng-container>
                </div>
              </div>

              <!-- Cart -->
              <a routerLink="/cart" class="relative group">
                <div class="w-10 h-10 bg-[#5c5c56] rounded-full flex items-center justify-center text-white group-hover:bg-[#3a3a35] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span *ngIf="cart.totalItems() > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-[#bc8375] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                  {{ cart.totalItems() }}
                </span>
              </a>

              <button (click)="toggleMobileMenu()" class="md:hidden w-10 h-10 border border-[#e5e2dd] rounded-full flex items-center justify-center text-[#3a3a35]" aria-label="Toggle navigation">
                <svg *ngIf="!isMobileMenuOpen()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <svg *ngIf="isMobileMenuOpen()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div *ngIf="isMobileMenuOpen()" class="md:hidden border-t border-[#f1efe9] py-5 space-y-5">
          <div class="relative">
            <input
              type="text"
              placeholder="Search"
              class="w-full bg-white border border-[#e5e2dd] rounded-full px-5 py-3 text-sm text-[#3a3a35] font-light placeholder-[#8c8c88] focus:outline-none focus:border-[#3a3a35] transition-all">
            <button class="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fbf9f6] rounded-full flex items-center justify-center text-[#8c8c88]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <nav class="grid grid-cols-1 gap-2 text-sm font-medium text-[#3a3a35]">
            <a routerLink="/products" (click)="closeMobileMenu()" class="py-3 border-b border-[#f1efe9]">All Products</a>
            <a
              *ngFor="let category of categories()"
              routerLink="/products"
              [queryParams]="{category: category.id}"
              (click)="closeMobileMenu()"
              class="py-3 border-b border-[#f1efe9]">
              {{ category.name }}
            </a>
            <a routerLink="/order-history" (click)="closeMobileMenu()" class="py-3">Order History</a>
          </nav>
        </div>

        <!-- Secondary Navigation -->
        <div class="hidden md:flex justify-center border-t border-[#f1efe9] py-5 gap-8 lg:gap-10 text-[13px] font-medium text-[#3a3a35] overflow-x-auto">
          <a routerLink="/products" class="whitespace-nowrap hover:text-[#bc8375] transition-colors">
            All Products
          </a>
          <a
            *ngFor="let category of categories()"
            routerLink="/products"
            [queryParams]="{category: category.id}"
            class="whitespace-nowrap flex items-center gap-1.5 hover:text-[#bc8375] transition-colors group">
            {{ category.name }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </a>
        </div>
      </div>
    </header>

    <!-- Click-outside overlay to close dropdown -->
    <div *ngIf="isUserMenuOpen()" (click)="closeUserMenu()" class="fixed inset-0" style="z-index: 49;"></div>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private productService = inject(ProductService);

  isUserMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);
  categories = toSignal(this.productService.getCategories(), { initialValue: [] });

  toggleUserMenu() {
    this.isUserMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  onLogout() {
    this.closeUserMenu();
    this.closeMobileMenu();
    this.auth.logout();
  }
}
