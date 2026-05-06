import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 md:pt-32 lg:pt-48 pb-20 md:pb-32 bg-white min-h-screen">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div *ngIf="loading()" class="animate-pulse">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24 xl:gap-32">
            <div class="bg-[#f2f1ec] aspect-square md:aspect-[4/5] rounded-[2rem] lg:rounded-[3rem]"></div>
            <div class="space-y-8 pt-10">
              <div class="h-4 bg-gray-100 rounded w-1/4"></div>
              <div class="h-16 bg-gray-100 rounded w-3/4"></div>
              <div class="h-8 bg-gray-100 rounded w-1/4"></div>
              <div class="h-40 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading() && product()" class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24 xl:gap-32 items-start">
          
          <!-- Image Gallery (Left Side) -->
          <div class="relative md:sticky md:top-36 opacity-100">
            <div class="bg-white border-2 border-[#3a3a35]/10 shadow-lg aspect-square md:aspect-[4/5] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden flex items-center justify-center group opacity-100">
              <img [src]="product()?.imageUrl || 'https://placehold.co/600x800/f7f7f7/555?text=Product'" [alt]="product()?.name" class="w-full h-full object-cover opacity-100 contrast-125 saturate-125 brightness-110 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700">
            </div>
            <!-- Decorative Elements -->
            <div class="hidden md:block absolute -top-6 -left-6 w-32 h-32 rounded-full border border-[#f1efe9] -z-10"></div>
          </div>

          <!-- Product Info (Right Side) -->
          <div class="flex flex-col pt-0 md:pt-4 opacity-100">
            <!-- Breadcrumb -->
            <nav class="flex flex-wrap gap-y-2 mb-8 md:mb-12 text-[10px] font-bold text-[#c4c2be] uppercase tracking-[0.18em] sm:tracking-[0.25em]">
              <a routerLink="/" class="hover:text-[#3a3a35] transition-colors">Home</a>
              <span class="mx-4">/</span>
              <a routerLink="/products" class="hover:text-[#3a3a35] transition-colors">Collection</a>
              <span class="mx-4">/</span>
              <span class="text-[#3a3a35] break-words">{{ product()?.name }}</span>
            </nav>

            <h1 class="text-4xl sm:text-5xl lg:text-7xl font-serif text-[#3a3a35] leading-tight mb-6 tracking-tight break-words">
              {{ product()?.name }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 sm:gap-8 mb-10 md:mb-12">
              <span class="text-2xl sm:text-3xl font-light text-[#3a3a35]">EGP {{ product()?.price | number:'1.2-2' }}</span>
              <div class="h-6 w-px bg-[#e5e2dd]"></div>
              <span [class]="product()!.stock > 0 ? 'text-[#8c8c88]' : 'text-red-400'" class="text-[13px] font-medium uppercase tracking-[0.1em]">
                {{ product()!.stock > 0 ? 'In Stock' : 'Unavailable' }}
              </span>
            </div>

            <!-- Add to Cart Area -->
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-14 md:mb-20">
              <button 
                (click)="addToCart()"
                [disabled]="product()!.stock === 0"
                class="flex-1 bg-[#3a3a35] text-white py-5 rounded-full flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-[#252520] transition-all duration-300">
                ADD TO CART
              </button>
              
              <button class="w-full sm:w-16 h-14 sm:h-16 rounded-full border border-[#e5e2dd] text-[#c4c2be] hover:text-[#bc8375] hover:border-[#bc8375] flex items-center justify-center transition-all bg-white group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:fill-[#bc8375] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <!-- Description -->
            <div class="mb-14 md:mb-20">
              <h3 class="text-[10px] font-bold text-[#bc8375] uppercase tracking-[0.25em] mb-6">The Details</h3>
              <p class="text-base md:text-[17px] text-[#3a3a35] leading-relaxed font-light opacity-80">
                {{ product()?.description }}
              </p>
            </div>

            <!-- Features -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 border-t border-[#f1efe9] pt-12">
              <div class="flex gap-6">
                <div class="w-12 h-12 rounded-full bg-[#fbf9f6] flex items-center justify-center text-[#bc8375] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <div>
                  <h4 class="text-[#3a3a35] font-bold text-[11px] uppercase tracking-widest mb-2">Qatari Delivery</h4>
                  <p class="text-[13px] text-[#8c8c88] font-light">Complimentary 3-5 day delivery</p>
                </div>
              </div>
              <div class="flex gap-6">
                <div class="w-12 h-12 rounded-full bg-[#fbf9f6] flex items-center justify-center text-[#bc8375] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
                  <h4 class="text-[#3a3a35] font-bold text-[11px] uppercase tracking-widest mb-2">Cash on Delivery</h4>
                  <p class="text-[13px] text-[#8c8c88] font-light">Payment upon collection</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div *ngIf="!loading() && !product()" class="text-center py-48">
          <h3 class="text-3xl font-serif text-[#3a3a35] mb-8">Product not found</h3>
          <a routerLink="/products" class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#bc8375] border-b border-[#bc8375] pb-2 hover:opacity-50 transition-all">Return to Collection</a>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  product = signal<Product | null>(null);
  loading = signal(true);

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) this.loadProduct(id);
    });
  }

  loadProduct(id: string) {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p);
      this.toastService.show(`${p.name} added to cart`, 'success');
    }
  }
}
