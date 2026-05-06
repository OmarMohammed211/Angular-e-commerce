import { Component, inject, signal, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, submit, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormField],
  template: `
    <div class="min-h-screen flex bg-[#fbf9f6]">
      
      <!-- Left Side - Lifestyle Imagery -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515378960530-7c0da622941f?auto=format&fit=crop&q=80&w=1200" alt="Luxury Wellness" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-[#3a3528]/20 mix-blend-overlay"></div>
        <div class="absolute inset-0 flex flex-col justify-between p-16 text-white">
          <a routerLink="/" class="text-2xl font-serif font-bold tracking-[0.3em] uppercase flex flex-col w-fit">
            ELEVARE
            <span class="w-1.5 h-1.5 rounded-full bg-white mt-1 ml-4"></span>
          </a>
          <div class="max-w-md">
            <h2 class="text-4xl font-serif font-bold mb-4">Welcome back to your wellbeing journey.</h2>
            <p class="font-light text-white/80">Curated essentials designed to elevate your everyday standard.</p>
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
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#4a4a4a] mb-2">Sign In</h2>
            <p class="text-[#666666] font-light">Enter your details to access your account.</p>
          </div>

          <form (submit)="onLogin(); $event.preventDefault()" class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#4a4a4a] mb-2">Email Address</label>
              <input 
                type="email" 
                [formField]="loginForm.email"
                class="w-full bg-transparent border-b border-gray-300 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#b67b6b] transition-colors"
                placeholder="you@example.com">
              @if (loginForm.email().touched() && loginForm.email().errors().length) {
                <span class="text-[#b67b6b] text-xs mt-2 block">{{ loginForm.email().errors()[0].message }}</span>
              }
            </div>

            <div>
              <div class="flex justify-between items-end mb-2">
                <label class="block text-xs font-bold uppercase tracking-widest text-[#4a4a4a]">Password</label>
                <a href="#" class="text-xs text-gray-400 hover:text-[#b67b6b] transition-colors underline underline-offset-4">Forgot?</a>
              </div>
              <input 
                type="password" 
                [formField]="loginForm.password"
                class="w-full bg-transparent border-b border-gray-300 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#b67b6b] transition-colors"
                placeholder="••••••••">
              @if (loginForm.password().touched() && loginForm.password().errors().length) {
                <span class="text-[#b67b6b] text-xs mt-2 block">{{ loginForm.password().errors()[0].message }}</span>
              }
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm().pending()"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-xs sm:text-sm uppercase tracking-widest py-4">
              Sign In
            </button>
            
            <div *ngIf="error()" class="p-4 bg-red-50 border border-red-100 rounded-lg text-red-500 text-sm text-center">
              {{ error() }}
            </div>
          </form>

          <div class="mt-10 sm:mt-12 pt-8 text-center border-t border-gray-200">
            <p class="text-sm text-[#666666] font-light">
              Don't have an account? 
              <a routerLink="/auth/register" class="text-[#b67b6b] font-medium hover:underline underline-offset-4 ml-1">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  error = signal<string | null>(null);

  model = signal({
    email: '',
    password: ''
  });

  loginForm = form(this.model, (s) => {
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

  onLogin() {
    this.error.set(null);
    submit(this.loginForm, async () => {
      const { email, password } = this.model();
      this.authService.login(email, password).subscribe({
        next: () => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/orders']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Invalid credentials');
        }
      });
    });
  }
}
