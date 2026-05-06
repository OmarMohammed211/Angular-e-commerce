import { Component, inject, signal, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, submit, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormField],
  template: `
    <div class="min-h-screen flex bg-[#fbf9f6]">
      
      <!-- Left Side - Lifestyle Imagery -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1608051785568-1bc047c6175e?auto=format&fit=crop&q=80&w=1200" alt="Luxury Wellness Skincare" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-[#3a3528]/10 mix-blend-overlay"></div>
        <div class="absolute inset-0 flex flex-col justify-between p-16 text-white">
          <a routerLink="/" class="text-2xl font-serif font-bold tracking-[0.3em] uppercase flex flex-col w-fit">
            ELEVARE
            <span class="w-1.5 h-1.5 rounded-full bg-white mt-1 ml-4"></span>
          </a>
          <div class="max-w-md">
            <h2 class="text-4xl font-serif font-bold mb-4">Discover the art of living well.</h2>
            <p class="font-light text-white/90 drop-shadow-md">Join our exclusive community to experience curated essentials and early access to our finest collections.</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Minimalist Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center px-4 py-24 sm:p-16 lg:p-24 relative fade-in">
        <a routerLink="/" class="lg:hidden absolute top-8 left-4 sm:left-8 text-lg sm:text-xl font-serif font-bold text-[#5c5c56] tracking-[0.24em] sm:tracking-[0.3em] uppercase flex flex-col w-fit">
          ELEVARE
          <span class="w-1.5 h-1.5 rounded-full bg-[#87877e] mt-1 ml-4"></span>
        </a>

        <div class="w-full max-w-md">
          <div class="mb-8 sm:mb-12">
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#4a4a4a] mb-2">Create Account</h2>
            <p class="text-[#666666] font-light">Enter your details to begin your journey.</p>
          </div>

          <form (submit)="onRegister(); $event.preventDefault()" class="space-y-6">
            
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#4a4a4a] mb-2">Full Name</label>
              <input 
                type="text" 
                [formField]="registerForm.name"
                class="w-full bg-transparent border-b border-gray-300 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#b67b6b] transition-colors"
                placeholder="John Doe">
              @if (registerForm.name().touched() && registerForm.name().errors().length) {
                <span class="text-[#b67b6b] text-xs mt-2 block">{{ registerForm.name().errors()[0].message }}</span>
              }
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#4a4a4a] mb-2">Email Address</label>
              <input 
                type="email" 
                [formField]="registerForm.email"
                class="w-full bg-transparent border-b border-gray-300 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#b67b6b] transition-colors"
                placeholder="you@example.com">
              @if (registerForm.email().touched() && registerForm.email().errors().length) {
                <span class="text-[#b67b6b] text-xs mt-2 block">{{ registerForm.email().errors()[0].message }}</span>
              }
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#4a4a4a] mb-2">Password</label>
              <input 
                type="password" 
                [formField]="registerForm.password"
                class="w-full bg-transparent border-b border-gray-300 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#b67b6b] transition-colors"
                placeholder="••••••••">
              @if (registerForm.password().touched() && registerForm.password().errors().length) {
                <span class="text-[#b67b6b] text-xs mt-2 block">{{ registerForm.password().errors()[0].message }}</span>
              }
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm().pending()"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-xs sm:text-sm uppercase tracking-widest py-4">
              Create Account
            </button>
            
            <div *ngIf="error()" class="p-4 bg-red-50 border border-red-100 rounded-lg text-red-500 text-sm text-center">
              {{ error() }}
            </div>
          </form>

          <div class="mt-10 sm:mt-12 pt-8 text-center border-t border-gray-200">
            <p class="text-sm text-[#666666] font-light">
              Already have an account? 
              <a routerLink="/auth/login" class="text-[#b67b6b] font-medium hover:underline underline-offset-4 ml-1">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  error = signal<string | null>(null);

  model = signal({
    name: '',
    email: '',
    password: ''
  });

  registerForm = form(this.model, (s) => {
    required(s.name, { message: 'Name is required' });
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email address' });
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 6, { message: 'Password must be at least 6 characters' });
  });

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.from('.fade-in', {
        x: 20,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    }
  }

  onRegister() {
    this.error.set(null);
    submit(this.registerForm, async () => {
      const { name, email, password } = this.model();
      this.authService.register(name, email, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Registration failed');
        }
      });
    });
  }
}
