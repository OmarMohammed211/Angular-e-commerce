import { Component, inject, PLATFORM_ID, AfterViewInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 md:pt-32 pb-16 md:pb-24 bg-[#fbf9f6] min-h-screen">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-10 md:mb-16 fade-in text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#4a4a4a] tracking-tight mb-2">Shopping Bag</h1>
          <p class="text-[#666666] font-light">Review your selected essentials.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-10 lg:gap-24">
          <!-- Cart Items -->
          <div class="flex-1 space-y-0 fade-in-delay">
            <div *ngIf="cart.items().length === 0" class="text-center py-20 md:py-32 border-t border-b border-gray-200">
              <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-[#4a4a4a] mb-2">Your bag is empty</h3>
              <p class="text-[#666666] font-light mb-8">Take a moment to discover our collection.</p>
              <a routerLink="/products" class="text-sm font-bold uppercase tracking-widest text-[#b67b6b] border-b border-[#b67b6b] pb-1 hover:text-[#9c6657] hover:border-[#9c6657] transition-colors">
                Return to Collection
              </a>
            </div>

            <!-- Item Rows -->
            <div *ngFor="let item of cart.items()" class="cart-item flex flex-col sm:flex-row gap-5 sm:gap-8 py-6 sm:py-8 border-t border-gray-200 first:border-t-0 group">
              
              <div class="h-44 w-full sm:h-32 sm:w-32 rounded-xl overflow-hidden flex-shrink-0 bg-white p-2">
                <img [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-contain mix-blend-multiply">
              </div>
              
              <div class="flex-1 flex flex-col justify-between py-1">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="text-lg font-serif font-bold text-[#4a4a4a] mb-1">
                      <a [routerLink]="['/products', item.id]" class="hover:text-[#b67b6b] transition-colors">{{ item.name }}</a>
                    </h3>
                    <p class="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Ref: {{ item.id.substring(0, 8) }}</p>
                  </div>
                  <button (click)="cart.removeFromCart(item.id)" class="text-gray-300 hover:text-[#b67b6b] transition-colors p-2 -mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mt-6 sm:mt-0">
                  <div class="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
                    <button (click)="cart.updateQuantity(item.id, item.quantity - 1)" class="text-gray-400 hover:text-[#b67b6b] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-6 text-center text-xs font-bold text-[#4a4a4a]">{{ item.quantity }}</span>
                    <button (click)="cart.updateQuantity(item.id, item.quantity + 1)" class="text-gray-400 hover:text-[#b67b6b] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span class="text-lg font-medium text-[#b67b6b]">EGP {{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
            
            <div *ngIf="cart.items().length > 0" class="border-t border-gray-200 pt-8 mt-0"></div>
          </div>

          <!-- Summary -->
          <div *ngIf="cart.items().length > 0" class="w-full lg:w-96 fade-in-delay">
            <div class="bg-white rounded-2xl md:rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-sm lg:sticky lg:top-32">
              <h2 class="text-xs font-bold text-[#4a4a4a] uppercase tracking-widest mb-8">Order Summary</h2>
              
              <div class="space-y-6 mb-10">
                <div class="flex justify-between text-sm">
                  <span class="text-[#666666] font-light">Subtotal</span>
                  <span class="text-[#4a4a4a] font-medium">EGP {{ cart.totalAmount() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-[#666666] font-light">Shipping</span>
                  <span class="text-[#b67b6b] font-medium text-xs tracking-wider uppercase">Complimentary</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-[#666666] font-light">Estimated Tax</span>
                  <span class="text-[#4a4a4a] font-medium">EGP 0.00</span>
                </div>
                <div class="h-px bg-gray-100 my-2"></div>
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold uppercase tracking-widest text-[#4a4a4a]">Total</span>
                  <span class="text-2xl font-serif font-bold text-[#b67b6b]">EGP {{ cart.totalAmount() | number:'1.2-2' }}</span>
                </div>
              </div>

              <div class="mb-8 rounded-2xl border border-[#f1efe9] bg-[#fbf9f6] p-4">
                <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8c8c88] mb-3">Promo code</p>
                <div class="flex gap-2">
                  <input
                    type="text"
                    placeholder="ELEVARE10"
                    class="min-w-0 flex-1 bg-white border border-[#e5e2dd] rounded-full px-4 py-2.5 text-sm text-[#4a4a4a] focus:outline-none focus:border-[#b67b6b]">
                  <button (click)="applyPromoCode()" class="rounded-full bg-[#3a3a35] text-white px-4 text-[10px] font-bold uppercase tracking-wider">
                    Apply
                  </button>
                </div>
                <p *ngIf="promoMessage()" class="mt-3 text-xs text-[#b67b6b]">{{ promoMessage() }}</p>
              </div>

              <a routerLink="/checkout" class="block w-full btn-primary py-4 text-center text-xs uppercase tracking-widest font-bold mb-6">
                PROCEED TO CHECKOUT
              </a>
              
              <div class="flex items-center justify-center gap-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p class="text-[10px] uppercase tracking-widest font-bold">Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>

        <section *ngIf="cart.items().length > 0 && addOnProducts().length > 0" class="mt-16 md:mt-24 border-t border-gray-200 pt-10 md:pt-14">
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b67b6b] mb-3">Complete your order</p>
              <h2 class="text-3xl font-serif font-bold text-[#4a4a4a]">Popular add-ons</h2>
            </div>
            <a routerLink="/products" class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4a4a4a] border-b border-[#4a4a4a] pb-1 w-fit">Browse more</a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div *ngFor="let product of addOnProducts()" class="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
              <div class="w-20 h-24 rounded-xl bg-[#fbf9f6] flex-shrink-0 p-2">
                <img [src]="product.imageUrl || 'https://placehold.co/240x300/f2f1ec/a0a0a0?text=Product'" [alt]="product.name" class="w-full h-full object-contain mix-blend-multiply">
              </div>
              <div class="min-w-0 flex-1">
                <a [routerLink]="['/products', product.id]" class="block text-sm font-semibold text-[#4a4a4a] leading-snug hover:text-[#b67b6b] transition-colors truncate">{{ product.name }}</a>
                <p class="text-sm text-[#b67b6b] mt-2">EGP {{ product.price | number:'1.2-2' }}</p>
                <button (click)="addToCart(product)" class="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3a3a35] border-b border-[#3a3a35] pb-1 hover:text-[#b67b6b] hover:border-[#b67b6b] transition-colors">
                  Add item
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `
})
export class CartComponent implements AfterViewInit {
  cart = inject(CartService);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  promoMessage = signal('');
  addOnProducts = toSignal(this.productService.getProducts().pipe(map(products => products.slice(0, 3))), { initialValue: [] });

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        gsap.from('.fade-in', {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
        
        gsap.from('.fade-in-delay', {
          y: 30,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        });

        gsap.from('.cart-item', {
          x: -20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.4,
          ease: 'power2.out'
        });
      }, 50);
    }
  }

  applyPromoCode() {
    this.promoMessage.set('Promo code saved. Discount validation will happen during checkout.');
  }

  addToCart(product: any) {
    this.cart.addToCart(product);
    this.toastService.show(`${product.name} added to cart`, 'success');
  }
}
