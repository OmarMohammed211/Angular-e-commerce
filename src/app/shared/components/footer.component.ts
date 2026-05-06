import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-white pt-16 md:pt-24 lg:pt-32 pb-10 md:pb-16 border-t border-[#f1efe9]">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-16 lg:gap-24 mb-14 md:mb-24">
          
          <!-- Brand & Newsletter -->
          <div class="sm:col-span-2 md:col-span-12 lg:col-span-5">
            <div class="flex flex-col mb-10">
              <span class="text-2xl sm:text-3xl font-serif text-[#3a3a35] tracking-[0.28em] sm:tracking-[0.4em] uppercase leading-none">ELEVARE</span>
              <span class="w-2 h-2 rounded-full bg-[#3a3a35] mt-2"></span>
            </div>
            
            <p class="text-[#3a3a35] font-light text-base sm:text-lg md:text-xl mb-8 md:mb-12 max-w-sm leading-relaxed tracking-tight">
              Join our community to receive curated insights on wellness, exclusive releases, and early access to events.
            </p>
            
            <form class="flex flex-col sm:flex-row gap-4 sm:gap-0 border-b border-[#3a3a35] pb-4 max-w-sm group">
              <input 
                type="email" 
                placeholder="Email Address" 
                class="bg-transparent w-full focus:outline-none text-[#3a3a35] placeholder-[#c4c2be] font-light text-sm">
              <button type="submit" class="text-left sm:text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[#3a3a35] hover:opacity-50 transition-all sm:ml-4">
                Subscribe
              </button>
            </form>
          </div>
          
          <!-- Links Columns -->
          <div class="md:col-span-4 lg:col-span-2">
            <h4 class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#bc8375] mb-5 md:mb-10">Shop</h4>
            <ul class="space-y-5">
              <li><a routerLink="/products" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">The Collection</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'skincare'}" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Skincare</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'body'}" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Body</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'gifting'}" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Gifting</a></li>
            </ul>
          </div>
          
          <div class="md:col-span-4 lg:col-span-2">
            <h4 class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#bc8375] mb-5 md:mb-10">About</h4>
            <ul class="space-y-5">
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Our Story</a></li>
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Ingredients</a></li>
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Sustainability</a></li>
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Journal</a></li>
            </ul>
          </div>

          <div class="md:col-span-4 lg:col-span-3">
            <h4 class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#bc8375] mb-5 md:mb-10">Support</h4>
            <ul class="space-y-5">
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Contact</a></li>
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Shipping & Returns</a></li>
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">FAQ</a></li>
              <li><a href="#" class="text-[#3a3a35] hover:text-[#bc8375] transition-colors text-sm font-light">Terms & Privacy</a></li>
            </ul>
          </div>

        </div>
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-8 md:pt-12 border-t border-[#f1efe9] text-[#8c8c88] text-[10px] font-bold uppercase tracking-[0.15em]">
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-10">
            <p>&copy; 2026 ELEVARE WELLNESS. All rights reserved.</p>
            <p class="hidden md:block">Designed with care in Qatar</p>
          </div>
          <div class="flex flex-wrap gap-5 sm:gap-10">
            <a href="#" class="hover:text-[#3a3a35] transition-colors">Instagram</a>
            <a href="#" class="hover:text-[#3a3a35] transition-colors">Pinterest</a>
            <a href="#" class="hover:text-[#3a3a35] transition-colors">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
