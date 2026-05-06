import { Component, inject, signal, effect, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { gsap } from 'gsap';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-32 bg-white min-h-screen">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <!-- Header & Search -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 mb-12 md:mb-20 fade-in">
          <div class="max-w-2xl">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-serif text-[#3a3a35] tracking-tight mb-4 md:mb-6">
              Our <span class="italic font-light">Collection</span>
            </h1>
            <p class="text-[#8c8c88] font-light text-base sm:text-lg md:text-xl leading-relaxed">
              Explore our thoughtfully curated selection of premium essentials, handpicked across every category to begin your wellbeing journey.
            </p>
          </div>
          
          <div class="w-full md:w-96 relative group">
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch($event)"
              placeholder="Search collection..." 
              class="w-full bg-white border border-[#e5e2dd] rounded-full px-8 py-4 text-sm text-[#3a3a35] font-light placeholder-[#8c8c88] focus:outline-none focus:border-[#3a3a35] transition-all">
            <button class="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#fbf9f6] rounded-full flex items-center justify-center text-[#8c8c88] group-hover:text-[#3a3a35] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Categories Filter -->
        <div class="flex gap-6 md:gap-12 border-b border-[#f1efe9] pb-4 md:pb-6 mb-12 md:mb-20 overflow-x-auto no-scrollbar fade-in">
          <button 
            (click)="filterByCategory('')"
            [class.text-[#bc8375]]="!selectedCategoryId()"
            [class.border-[#bc8375]]="!selectedCategoryId()"
            [class.border-transparent]="selectedCategoryId()"
            class="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c88] hover:text-[#3a3a35] border-b-2 pb-4 transition-all duration-300">
            All Essentials
          </button>
          <button 
            *ngFor="let cat of categories()"
            (click)="filterByCategory(cat.id)"
            [class.text-[#bc8375]]="selectedCategoryId() === cat.id"
            [class.border-[#bc8375]]="selectedCategoryId() === cat.id"
            [class.border-transparent]="selectedCategoryId() !== cat.id"
            class="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c88] hover:text-[#3a3a35] border-b-2 pb-4 transition-all duration-300">
            {{ cat.name }}
          </button>
        </div>

        <!-- Commerce Promo Strip -->
        <div class="mb-12 md:mb-20 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-[#3a3a35] text-white p-5 sm:p-6 flex items-center gap-4">
            <div class="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2" /></svg>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-[0.22em] text-white/60 font-bold">Deal of the day</p>
              <p class="text-sm font-medium mt-1">Save more on curated essentials</p>
            </div>
          </div>
          <div class="bg-[#fbf9f6] border border-[#e5e2dd] p-5 sm:p-6 flex items-center gap-4">
            <div class="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 text-[#bc8375]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-[0.22em] text-[#8c8c88] font-bold">Fast delivery</p>
              <p class="text-sm font-medium text-[#3a3a35] mt-1">Complimentary shipping on all orders</p>
            </div>
          </div>
          <div class="bg-[#fbf9f6] border border-[#e5e2dd] p-5 sm:p-6 flex items-center gap-4">
            <div class="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 text-[#bc8375]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-[0.22em] text-[#8c8c88] font-bold">Secure checkout</p>
              <p class="text-sm font-medium text-[#3a3a35] mt-1">Cash on delivery available</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="animate-pulse flex flex-col">
            <div class="bg-[#f2f1ec] aspect-[4/5] rounded-[2.5rem] mb-8"></div>
            <div class="h-3 bg-gray-100 rounded w-1/4 mb-4"></div>
            <div class="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
            <div class="mt-auto h-12 border border-gray-100 rounded-full w-full"></div>
          </div>
        </div>

        <!-- Product Grid -->
        <div *ngIf="!loading() && products().length > 0" class="product-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 lg:gap-x-10 xl:gap-x-12 gap-y-14 md:gap-y-20 lg:gap-y-24">
          <div *ngFor="let product of products()" class="product-item flex flex-col relative group">
            <button class="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#c4c2be] hover:text-[#bc8375] shadow-sm transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            
            <div class="product-card-bg aspect-[4/5] p-8 md:p-10 xl:p-12 flex items-center justify-center mb-6 md:mb-8 relative cursor-pointer hover:shadow-2xl transition-all duration-700" [routerLink]="['/products', product.id]">
              <img [src]="product.imageUrl || 'https://placehold.co/400x500/f2f1ec/a0a0a0?text=Product'" [alt]="product.name" class="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000">
            </div>
            
            <div class="flex-grow flex flex-col items-center text-center px-4">
              <p class="text-[#bc8375] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">ELEVARE</p>
              <a [routerLink]="['/products', product.id]" class="text-[#3a3a35] text-[15px] font-medium hover:text-[#bc8375] transition-colors leading-tight block mb-6 tracking-tight">
                {{ product.name }}
              </a>
            </div>
            
            <div class="mt-auto flex flex-col items-center">
              <p class="text-[15px] font-light text-[#3a3a35] mb-8">EGP {{ product.price | number:'1.2-2' }}</p>
              <button (click)="addToCart($event, product)" class="w-full py-4.5 rounded-full border border-[#e5e2dd] text-[11px] font-bold text-[#3a3a35] uppercase tracking-[0.2em] hover:bg-[#3a3a35] hover:text-white transition-all duration-500">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading() && products().length === 0" class="text-center py-24 md:py-40">
          <div class="w-24 h-24 rounded-full bg-[#fbf9f6] flex items-center justify-center mx-auto mb-8 text-[#c4c2be]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-3xl font-serif text-[#3a3a35] mb-4">No essentials found</h3>
          <p class="text-[#8c8c88] font-light text-base md:text-xl">We couldn't find any products matching your criteria.</p>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements AfterViewInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  products = signal<Product[]>([]);
  loading = signal(true);
  searchQuery = '';
  selectedCategoryId = signal<string>('');

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategoryId.set(params['category']);
      }
      this.loadProducts();
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.from('.fade-in', {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }

  private animateGrid() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        gsap.from('.product-item', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power2.out'
        });
      }, 50);
    }
  }

  loadProducts() {
    this.loading.set(true);
    const categoryId = this.selectedCategoryId();
    
    this.productService.getProducts(categoryId || undefined)
      .subscribe({
        next: (prods) => {
          this.products.set(prods);
          this.loading.set(false);
          this.animateGrid();
        },
        error: () => this.loading.set(false)
      });
  }

  filterByCategory(id: string) {
    this.selectedCategoryId.set(id);
    this.loadProducts();
  }

  onSearch(query: string) {
    if (!query) {
      this.loadProducts();
      return;
    }
    
    this.loading.set(true);
    this.productService.searchProducts(query).subscribe({
      next: (prods) => {
        this.products.set(prods);
        this.loading.set(false);
        this.animateGrid();
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.toastService.show(`${product.name} added to cart`, 'success');
  }
}
