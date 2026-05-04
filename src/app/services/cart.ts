import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product, CartItem } from '../models/store.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Initialize with empty array first to avoid server-side crashes
  private cartItems = signal<CartItem[]>(this.loadFromStorage());

  items = this.cartItems.asReadonly();
  count = computed(() => this.cartItems().reduce((acc, i) => acc + i.quantity, 0));
  total = computed(() => this.cartItems().reduce((acc, i) => acc + (i.product.price * i.quantity), 0));

  constructor() {
    effect(() => {
      // Only attempt to save if we are in the browser
      if (this.isBrowser) {
        localStorage.setItem('ng_cart', JSON.stringify(this.cartItems()));
      }
    });
  }

  // ... (addToCart, updateQty, and remove methods remain the same)

  private loadFromStorage(): CartItem[] {
    // Check if we are in the browser before accessing localStorage[cite: 1]
    if (this.isBrowser) {
      const data = localStorage.getItem('ng_cart');
      return data ? JSON.parse(data) : [];
    }
    // Return empty array if running on the server
    return [];
  }
}

