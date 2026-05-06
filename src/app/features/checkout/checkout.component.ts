import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormField],
  template: `
    <div class="pt-24 md:pt-32 pb-16 md:pb-24 bg-[#fbf9f6] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        
        <header class="mb-8 md:mb-12">
          <h1 class="text-3xl sm:text-4xl font-light text-[#3a3a35] tracking-tight mb-2">Checkout</h1>
          <p class="text-[#8c8c88] font-light">Complete your purchase below.</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          <!-- Form Section -->
          <div class="lg:col-span-7 space-y-12">
            
            <section>
              <h2 class="text-xs font-semibold text-[#3a3a35] uppercase tracking-[0.2em] mb-8 border-b border-[#e5e2dd] pb-4">Shipping Information</h2>
              
              <form (submit)="onPlaceOrder(); $event.preventDefault()" class="space-y-6 md:space-y-8">
                <div class="grid grid-cols-1 gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-semibold text-[#8c8c88] uppercase tracking-wider">Recipient</label>
                    <input 
                      type="text" 
                      [value]="auth.user()?.name" 
                      disabled
                      class="w-full bg-white/50 border border-[#e5e2dd] px-4 py-3 text-[#3a3a35] font-light focus:outline-none cursor-not-allowed">
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-semibold text-[#8c8c88] uppercase tracking-wider">Shipping Address</label>
                    <textarea 
                      [formField]="checkoutForm.address"
                      rows="4"
                      class="w-full bg-white border border-[#e5e2dd] px-4 py-3 text-[#3a3a35] font-light focus:border-[#3a3a35] transition-colors outline-none placeholder-[#c4c2be]"
                      placeholder="Street, Building, Apartment, City"></textarea>
                    @if (checkoutForm.address().touched() && checkoutForm.address().errors().length) {
                      <span class="text-red-800 text-[10px] uppercase tracking-tighter mt-1">{{ checkoutForm.address().errors()[0].message }}</span>
                    }
                  </div>
                </div>

                <div class="pt-4 md:pt-8">
                  <h2 class="text-xs font-semibold text-[#3a3a35] uppercase tracking-[0.2em] mb-6">Payment Method</h2>
                  <div class="p-5 sm:p-6 bg-white border border-[#3a3a35] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div class="flex items-center gap-4">
                      <div class="w-2 h-2 rounded-full bg-[#3a3a35]"></div>
                      <div>
                        <p class="text-sm font-medium text-[#3a3a35]">Cash on Delivery</p>
                        <p class="text-[10px] text-[#8c8c88] uppercase tracking-wider mt-1">Pay with cash upon arrival</p>
                      </div>
                    </div>
                    <span class="text-[10px] font-semibold text-[#3a3a35] uppercase tracking-widest bg-[#f1efe9] px-2 py-1">Standard</span>
                  </div>
                </div>

                <!-- Error Message Display -->
                <div *ngIf="errorMessage()" class="p-4 bg-red-50 border border-red-200 mt-6">
                  <div class="flex gap-3">
                    <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h3 class="text-sm font-medium text-red-800">Checkout Failed</h3>
                      <p class="text-xs text-red-600 mt-1 leading-relaxed break-words">{{ errorMessage() }}</p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  [disabled]="checkoutForm().pending() || cart.items().length === 0"
                  class="w-full bg-[#3a3a35] text-white py-4 sm:py-5 px-4 sm:px-8 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.3em] hover:bg-black transition-all disabled:bg-[#e5e2dd] disabled:cursor-not-allowed mt-4 leading-relaxed">
                  Confirm Order — EGP {{ cart.totalAmount() | number:'1.2-2' }}
                </button>
              </form>
            </section>
          </div>

          <!-- Summary Section -->
          <div class="lg:col-span-5">
            <div class="lg:sticky lg:top-32 p-6 sm:p-8 lg:p-10 bg-white border border-[#e5e2dd]">
              <h2 class="text-xs font-semibold text-[#3a3a35] uppercase tracking-[0.2em] mb-8 lg:mb-10">Your Selection</h2>
              
              <div class="space-y-6 sm:space-y-8 mb-8 lg:mb-10 max-h-[360px] lg:max-h-[400px] overflow-y-auto custom-scrollbar pr-2 sm:pr-4">
                <div *ngFor="let item of cart.items()" class="flex gap-6 items-start">
                  <div class="w-16 h-20 sm:w-20 sm:h-24 bg-[#fbf9f6] flex-shrink-0">
                    <img [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover grayscale-[0.2] mix-blend-multiply">
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-[#3a3a35] leading-snug">{{ item.name }}</h4>
                    <p class="text-[10px] text-[#8c8c88] uppercase tracking-wider mt-2">Qty: {{ item.quantity }} x EGP {{ item.price | number:'1.2-2' }}</p>
                    <p class="text-sm text-[#3a3a35] mt-2 font-light">EGP {{ (item.price * item.quantity) | number:'1.2-2' }}</p>
                  </div>
                </div>
              </div>

              <div class="pt-8 border-t border-[#f1efe9] space-y-4">
                <div class="flex justify-between text-xs tracking-wider">
                  <span class="text-[#8c8c88] uppercase">Subtotal</span>
                  <span class="text-[#3a3a35]">EGP {{ cart.totalAmount() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-xs tracking-wider">
                  <span class="text-[#8c8c88] uppercase">Delivery</span>
                  <span class="text-[#3a3a35] uppercase">Complimentary</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between gap-2 pt-6 mt-6 border-t border-[#3a3a35]">
                  <span class="text-xs font-bold text-[#3a3a35] uppercase tracking-widest">Grand Total</span>
                  <span class="text-lg font-light text-[#3a3a35]">EGP {{ cart.totalAmount() | number:'1.2-2' }}</span>
                </div>
              </div>

              <p class="mt-12 text-[9px] text-[#8c8c88] uppercase tracking-widest leading-loose text-center">
                Secure transaction guaranteed.<br>
                Managed by Elevare Logistics.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  errorMessage = signal<string>('');

  model = signal({
    address: ''
  });

  checkoutForm = form(this.model, (s) => {
    required(s.address, { message: 'Shipping address is required' });
  });

  onPlaceOrder() {
    this.errorMessage.set('');
    submit(this.checkoutForm, async () => {
      const user = this.auth.user();
      if (!user?.id) {
        this.router.navigate(['/auth/login']);
        return;
      }

      try {
        const res = await firstValueFrom(
          this.orderService.checkout(user.id, this.model().address.trim())
        );
        this.cart.clearCart();
        this.router.navigate(['/order-history'], { queryParams: { orderId: res._id } });
      } catch (err: any) {
        const message = err.error?.message;
        this.errorMessage.set(this.getCheckoutErrorMessage(message));
      }
    });
  }

  private getCheckoutErrorMessage(message: string | string[] | undefined): string {
    const normalizedMessage = Array.isArray(message) ? message.join(' ') : message;

    if (normalizedMessage?.toLowerCase().includes('insufficient stock')) {
      const productName = normalizedMessage.split('product:')[1]?.trim();
      return productName
        ? `${productName} is out of stock or does not have enough quantity available. Please update your cart before placing the order.`
        : 'One or more items in your cart are out of stock. Please update your cart before placing the order.';
    }

    return normalizedMessage || 'Failed to place order. Please try again.';
  }
}
