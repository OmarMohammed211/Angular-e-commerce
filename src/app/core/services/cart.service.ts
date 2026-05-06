import { Injectable, signal, inject, computed, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private apiUrl = `${environment.apiUrl}/cart`;

  private _items = signal<CartItem[]>([]);
  private _loading = signal(false);

  // Exposed Signals
  items = this._items.asReadonly();
  loading = this._loading.asReadonly();
  totalItems = computed(() => this._items().reduce((acc, item) => acc + item.quantity, 0));
  totalAmount = computed(() => this._items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  constructor() {
    this.loadCart();

    // React to auth changes — load cart from server when user logs in
    effect(() => {
      const user = this.authService.user();
      if (this.isBrowser) {
        if (user) {
          // User logged in — merge any guest items then load from server
          const guestCart = localStorage.getItem('cart_guest');
          if (guestCart) {
            const guestItems: CartItem[] = JSON.parse(guestCart);
            // Push guest items to server cart
            this.mergeGuestCartToServer(user.id, guestItems);
            localStorage.removeItem('cart_guest');
          } else {
            this.loadCartFromServer(user.id);
          }
        } else {
          // User logged out — load guest cart from localStorage
          const guestCart = localStorage.getItem('cart_guest');
          if (guestCart) {
            this._items.set(JSON.parse(guestCart));
          } else {
            this._items.set([]);
          }
        }
      }
    });

    // Persist guest cart to localStorage when not authenticated
    effect(() => {
      const items = this._items();
      const user = this.authService.user();
      if (this.isBrowser && !user) {
        localStorage.setItem('cart_guest', JSON.stringify(items));
      }
    });
  }

  /** Load cart from server (authenticated) or localStorage (guest) */
  private loadCart() {
    if (!this.isBrowser) return;

    const user = this.authService.user();
    if (user) {
      this.loadCartFromServer(user.id);
    } else {
      const guestCart = localStorage.getItem('cart_guest');
      if (guestCart) {
        this._items.set(JSON.parse(guestCart));
      }
    }
  }

  /** Fetch cart from MongoDB via backend API */
  private loadCartFromServer(userId: string) {
    this._loading.set(true);
    this.http.get<any>(`${this.apiUrl}/${userId}`).subscribe({
      next: (cart) => {
        const items = this.mapServerCartToItems(cart);
        this._items.set(items);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  /** Merge guest localStorage items into the server cart */
  private mergeGuestCartToServer(userId: string, guestItems: CartItem[]) {
    if (guestItems.length === 0) {
      this.loadCartFromServer(userId);
      return;
    }

    // Add each guest item to the server cart sequentially
    let completed = 0;
    for (const item of guestItems) {
      this.http.post<any>(`${this.apiUrl}/add`, {
        userId,
        productId: item.id,
        quantity: item.quantity
      }).subscribe({
        next: () => {
          completed++;
          if (completed === guestItems.length) {
            // All items merged — reload from server
            this.loadCartFromServer(userId);
          }
        },
        error: () => {
          completed++;
          if (completed === guestItems.length) {
            this.loadCartFromServer(userId);
          }
        }
      });
    }
  }

  /** Map the backend cart response to CartItem[] */
  private mapServerCartToItems(cart: any): CartItem[] {
    if (!cart || !cart.items || cart.items.length === 0) return [];

    return cart.items
      .filter((item: any) => item.productId) // Skip items where product was deleted
      .map((item: any) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        imageUrl: item.productId.image || '',
        description: item.productId.description || '',
        stock: item.productId.stock || 0,
        quantity: item.quantity
      }));
  }

  /** Add a product to cart */
  addToCart(product: Product) {
    const user = this.authService.user();

    if (user) {
      // Authenticated: send to server
      this.http.post<any>(`${this.apiUrl}/add`, {
        userId: user.id,
        productId: product.id,
        quantity: 1
      }).subscribe({
        next: (cart) => {
          this._items.set(this.mapServerCartToItems(cart));
        },
        error: (err) => {
          // Alert user of backend rejection (e.g., insufficient stock)
          if (err.error && err.error.message) {
            window.alert(err.error.message);
          } else {
            window.alert('Failed to add item to cart.');
          }
        }
      });
    } else {
      // Guest: localStorage only
      this.addToCartLocal(product);
    }
  }

  /** Local (in-memory) add to cart */
  private addToCartLocal(product: Product) {
    this._items.update(items => {
      const existingItem = items.find(i => i.id === product.id);
      if (existingItem) {
        return items.map(i => i.id === product.id 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  /** Remove an item from cart */
  removeFromCart(productId: string) {
    const user = this.authService.user();

    if (user) {
      this.http.delete<any>(`${this.apiUrl}/remove/${user.id}/${productId}`).subscribe({
        next: (cart) => {
          this._items.set(this.mapServerCartToItems(cart));
        },
        error: () => {
          this._items.update(items => items.filter(i => i.id !== productId));
        }
      });
    } else {
      this._items.update(items => items.filter(i => i.id !== productId));
    }
  }

  /** Update item quantity */
  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const user = this.authService.user();

    if (user) {
      this.http.patch<any>(`${this.apiUrl}/update-quantity`, {
        userId: user.id,
        productId,
        quantity
      }).subscribe({
        next: (cart) => {
          this._items.set(this.mapServerCartToItems(cart));
        },
        error: (err) => {
          if (err.error && err.error.message) {
            window.alert(err.error.message);
          } else {
            window.alert('Failed to update quantity.');
          }
          // Revert local state by reloading from server
          this.loadCartFromServer(user.id);
        }
      });
    } else {
      this._items.update(items => 
        items.map(i => i.id === productId ? { ...i, quantity } : i)
      );
    }
  }

  /** Clear the entire cart */
  clearCart() {
    const user = this.authService.user();

    if (user) {
      this.http.delete<any>(`${this.apiUrl}/clear/${user.id}`).subscribe({
        next: () => this._items.set([]),
        error: () => this._items.set([])
      });
    } else {
      this._items.set([]);
      if (this.isBrowser) {
        localStorage.removeItem('cart_guest');
      }
    }
  }
}
