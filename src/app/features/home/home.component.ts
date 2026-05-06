import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Banner -->
    <div class="relative w-full min-h-[560px] h-[72vh] md:h-[750px] bg-[#3a3528] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" alt="Online shopping bags and products" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/5"></div>
      <div class="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto">
        <h1 class="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-serif text-white mb-6 md:mb-8 leading-[0.95] tracking-tight">
          Your Everyday <br> <span class="italic font-light">Storefront</span>
        </h1>
        <p class="text-white/90 text-base sm:text-lg md:text-2xl font-light mb-8 md:mb-14 max-w-xl leading-relaxed">
          Shop curated essentials, limited-time offers, and fast delivery across Egypt.
        </p>
        <a routerLink="/products" class="btn-outline !text-white !border-white !px-12 !py-4 hover:!bg-white hover:!text-[#3a3a35] w-fit">
          SHOP NOW
        </a>
      </div>
      
      <!-- Dots indicator -->
      <div class="absolute bottom-8 right-6 md:bottom-12 md:right-12 flex gap-4">
        <div class="w-2 h-2 rounded-full bg-white"></div>
        <div class="w-2 h-2 rounded-full bg-white/30"></div>
      </div>
    </div>

    <!-- Promotional Ad Carousel -->
    <section class="bg-white py-6 md:py-10 border-b border-[#f1efe9]">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div class="relative overflow-hidden bg-[#3a3a35] min-h-[320px] md:min-h-[360px]">
          @for (slide of promoSlides; track slide.title; let i = $index) {
            <div
              class="absolute inset-0 transition-opacity duration-700"
              [class.opacity-100]="activePromoSlide() === i"
              [class.opacity-0]="activePromoSlide() !== i"
              [class.pointer-events-none]="activePromoSlide() !== i">
              <img [src]="slide.image" [alt]="slide.title" class="w-full h-full object-cover opacity-70">
              <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"></div>
              <div class="absolute inset-0 flex items-center px-5 sm:px-8 md:px-14 lg:px-20">
                <div class="max-w-lg text-white">
                  <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-4">{{ slide.eyebrow }}</p>
                  <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight mb-5">{{ slide.title }}</h2>
                  <p class="text-sm sm:text-base text-white/85 font-light leading-relaxed mb-8">{{ slide.copy }}</p>
                  <a routerLink="/products" [queryParams]="{category: slide.category}" class="inline-flex items-center justify-center bg-white text-[#3a3a35] px-7 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#fbf9f6] transition-colors">
                    Shop Offer
                  </a>
                </div>
              </div>
            </div>
          }

          <div class="absolute bottom-5 left-5 sm:left-8 md:left-14 lg:left-20 flex gap-3">
            @for (slide of promoSlides; track slide.title; let i = $index) {
              <button
                (click)="setPromoSlide(i)"
                [class.bg-white]="activePromoSlide() === i"
                [class.bg-white/30]="activePromoSlide() !== i"
                class="h-2.5 w-10 rounded-full transition-colors"
                aria-label="Select promotion">
              </button>
            }
          </div>

          <div class="absolute right-5 bottom-5 flex gap-3">
            <button (click)="previousPromoSlide()" class="w-10 h-10 rounded-full bg-white/90 text-[#3a3a35] flex items-center justify-center hover:bg-white transition-colors" aria-label="Previous promotion">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button (click)="nextPromoSlide()" class="w-10 h-10 rounded-full bg-white/90 text-[#3a3a35] flex items-center justify-center hover:bg-white transition-colors" aria-label="Next promotion">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Marquee -->
    <section class="py-12 bg-white border-b border-[#f1efe9] overflow-hidden">
      <div class="flex items-center gap-12 whitespace-nowrap animate-marquee">
        <div class="flex items-center gap-16 md:gap-32 px-12">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1024px-Coca-Cola_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1024px-Netflix_2015_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Apple_logo_grey.svg/505px-Apple_logo_grey.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <span class="text-2xl font-serif text-[#3a3a35] opacity-20 uppercase tracking-[0.4em]">ELEVARE</span>
        </div>
        <!-- Duplicate for seamless loop -->
        <div class="flex items-center gap-16 md:gap-32 px-12">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1024px-Coca-Cola_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1024px-Netflix_2015_logo.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Apple_logo_grey.svg/505px-Apple_logo_grey.svg.png" class="h-6 opacity-20 grayscale" alt="Partner">
          <span class="text-2xl font-serif text-[#3a3a35] opacity-20 uppercase tracking-[0.4em]">ELEVARE</span>
        </div>
      </div>
    </section>

    <!-- Shoppable Campaign Tiles -->
    <section class="py-16 md:py-24 bg-[#fbf9f6] border-b border-[#f1efe9]">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <p class="text-[10px] text-[#bc8375] font-bold tracking-[0.25em] uppercase mb-4">Shop by moment</p>
            <h2 class="text-4xl md:text-5xl font-serif text-[#3a3a35] leading-tight">Curated deals for every cart</h2>
          </div>
          <a routerLink="/products" class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3a3a35] border-b border-[#3a3a35] pb-1 w-fit">View all</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
          @for (campaign of campaigns; track campaign.title) {
            <a routerLink="/products" [queryParams]="{category: campaign.category}" class="group relative min-h-[280px] overflow-hidden bg-[#3a3a35]">
              <img [src]="campaign.image" [alt]="campaign.title" class="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-6 text-white">
                <span class="inline-flex bg-white text-[#3a3a35] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] mb-5">{{ campaign.badge }}</span>
                <h3 class="text-2xl font-serif text-white mb-2">{{ campaign.title }}</h3>
                <p class="text-sm text-white/80 font-light">{{ campaign.copy }}</p>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- The Elevare Standard -->
    <section class="py-16 md:py-24 bg-white border-b border-[#f1efe9]">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div class="lg:col-span-4">
          <h2 class="text-4xl sm:text-5xl font-serif text-[#3a3a35] mb-6 leading-tight">The <span class="italic font-light">Elevare</span> <br> Standard</h2>
          <p class="text-[10px] text-[#bc8375] font-bold tracking-[0.25em] uppercase">Provenance and purity, no compromise</p>
        </div>
        
        <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div class="flex flex-col items-center text-center group">
            <div class="w-24 h-24 rounded-full bg-[#fbf9f6] flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-[#3a3a35] group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M3 10a10 10 0 1120 0c0 5.523-8 14-10 14S3 15.523 3 10z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M12 10V6" /></svg>
            </div>
            <h3 class="font-bold text-[#3a3a35] mb-2 text-[10px] uppercase tracking-[0.2em]">Clean & Organic</h3>
            <p class="text-[10px] text-[#8c8c88] leading-relaxed uppercase tracking-[0.15em]">Gorgeously good for you, no nasties</p>
          </div>
          <div class="flex flex-col items-center text-center group">
            <div class="w-24 h-24 rounded-full bg-[#fbf9f6] flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-[#3a3a35] group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h3 class="font-bold text-[#3a3a35] mb-2 text-[10px] uppercase tracking-[0.2em]">Delivered Across Qatar</h3>
            <p class="text-[10px] text-[#8c8c88] leading-relaxed uppercase tracking-[0.15em]">Swiftly despatched, straight to your door</p>
          </div>
          <div class="flex flex-col items-center text-center group">
            <div class="w-24 h-24 rounded-full bg-[#fbf9f6] flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-[#3a3a35] group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 class="font-bold text-[#3a3a35] mb-2 text-[10px] uppercase tracking-[0.2em]">Personally Curated</h3>
            <p class="text-[10px] text-[#8c8c88] leading-relaxed uppercase tracking-[0.15em]">Handpicked by humans, for humans</p>
          </div>
          <div class="flex flex-col items-center text-center group">
            <div class="w-24 h-24 rounded-full bg-[#fbf9f6] flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-[#3a3a35] group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h3 class="font-bold text-[#3a3a35] mb-2 text-[10px] uppercase tracking-[0.2em]">Feel Gloriously Well</h3>
            <p class="text-[10px] text-[#8c8c88] leading-relaxed uppercase tracking-[0.15em]">Empowering you to take control of your wellbeing</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-20 md:py-32 bg-[#fbf9f6]">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-20">
        <!-- Left Side -->
        <div class="lg:w-[30%]">
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3a3a35] mb-6 md:mb-8 leading-tight tracking-tight">Featured<br>Products</h2>
          <p class="text-[#8c8c88] mb-8 md:mb-14 font-light text-lg sm:text-xl lg:text-2xl leading-relaxed tracking-tight">Most celebrated picks reserved exclusively for our community</p>
          <a routerLink="/products" class="btn-primary inline-flex items-center gap-4 group">
            SHOP THE COLLECTION
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
          
          <!-- Arrows -->
          <div class="hidden lg:flex gap-6 mt-20">
            <button class="w-14 h-14 rounded-full border border-[#e5e2dd] flex items-center justify-center text-[#8c8c88] hover:border-[#3a3a35] hover:text-[#3a3a35] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <button class="w-14 h-14 rounded-full border border-[#e5e2dd] flex items-center justify-center text-[#8c8c88] hover:border-[#3a3a35] hover:text-[#3a3a35] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        <!-- Products List -->
        <div class="lg:w-[70%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div *ngFor="let product of featuredProducts()" class="flex flex-col group relative">
            <button class="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#c4c2be] hover:text-[#bc8375] shadow-sm transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            <div class="product-card-bg aspect-[4/5] p-8 md:p-12 flex items-center justify-center mb-6 md:mb-8 relative cursor-pointer hover:shadow-2xl transition-all duration-700" [routerLink]="['/products', product.id]">
              <img [src]="product.imageUrl || 'https://placehold.co/400x500/f2f1ec/a0a0a0?text=Product'" [alt]="product.name" class="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000">
            </div>
            <div class="flex-grow">
              <p class="text-[#bc8375] text-[10px] font-bold uppercase tracking-[0.25em] mb-4">ELEVARE</p>
              <a [routerLink]="['/products', product.id]" class="text-[#3a3a35] text-[15px] font-medium hover:text-[#bc8375] transition-colors leading-tight block mb-6 tracking-tight">
                {{ product.name }}
              </a>
            </div>
            <div class="mt-auto">
              <p class="text-[15px] font-light text-[#3a3a35] mb-8">EGP {{ product.price | number:'1.2-2' }}</p>
              <button (click)="addToCart(product)" class="w-full py-4.5 rounded-full border border-[#e5e2dd] text-[11px] font-bold text-[#3a3a35] uppercase tracking-[0.2em] hover:bg-[#3a3a35] hover:text-white transition-all duration-500">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Floating Actions -->
    <a href="https://wa.me/yournumber" target="_blank" class="floating-whatsapp">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72 1.937 4.105 3.048 6.643 3.048h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>

    <!-- Cookie Bar -->
    <div *ngIf="showCookies()" class="fixed bottom-0 left-0 w-full bg-white border-t border-[#f1efe9] py-6 md:py-10 px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 md:gap-10 z-[10000] animate-in slide-in-from-bottom duration-1000">
      <div class="max-w-4xl">
        <p class="text-[#3a3a35] text-[13px] leading-relaxed font-light tracking-tight">
          This website uses cookies to supplement a balanced diet and provide a much deserved reward to the senses after consuming bland but nutritious meals. Accepting our cookies is optional but recommended, as they are delicious. See our <a href="#" class="underline font-normal">cookie policy</a>.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 shrink-0">
        <button (click)="acceptCookies()" class="btn-primary">ACCEPT ALL</button>
        <button (click)="acceptCookies()" class="text-[11px] font-bold text-[#3a3a35] uppercase tracking-[0.2em] hover:opacity-50 transition-all">PREFERENCES</button>
      </div>
    </div>
  `
})
export class HomeComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  
  showCookies = signal(true);
  activePromoSlide = signal(0);

  promoSlides = [
    {
      eyebrow: 'Weekend offer',
      title: 'Up to 25% off daily essentials',
      copy: 'Build a smarter basket with limited-time savings on pantry, wellness, and home favorites.',
      category: 'groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1800'
    },
    {
      eyebrow: 'Beauty edit',
      title: 'Buy more, glow more',
      copy: 'Bundle skincare and wellness picks with complimentary delivery on every order.',
      category: 'health',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1800'
    },
    {
      eyebrow: 'Home refresh',
      title: 'Small upgrades for a better routine',
      copy: 'Discover home and garden finds selected to make everyday living feel easier.',
      category: 'home',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1800'
    }
  ];

  campaigns = [
    {
      title: 'Stock the pantry',
      badge: 'Bundle deal',
      copy: 'Save on weekly staples and household favorites.',
      category: 'groceries',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Wellness reset',
      badge: 'Best sellers',
      copy: 'Curated health and beauty picks for everyday care.',
      category: 'health',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Home essentials',
      badge: 'New arrivals',
      copy: 'Fresh finds for your kitchen, garden, and living space.',
      category: 'home',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  // Get all products and slice to 3
  featuredProducts = toSignal(this.productService.getProducts().pipe(map(products => products.slice(0, 3))), { initialValue: [] });

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.toastService.show(`${product.name} was added successfully.`, 'success');
  }

  acceptCookies() {
    this.showCookies.set(false);
  }

  setPromoSlide(index: number) {
    this.activePromoSlide.set(index);
  }

  nextPromoSlide() {
    this.activePromoSlide.update(index => (index + 1) % this.promoSlides.length);
  }

  previousPromoSlide() {
    this.activePromoSlide.update(index => (index - 1 + this.promoSlides.length) % this.promoSlides.length);
  }
}
