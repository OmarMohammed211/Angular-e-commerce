import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 md:pt-32 pb-16 md:pb-24 bg-[#fbf9f6] min-h-screen">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-light text-[#3a3a35] tracking-tight mb-2">Order History</h1>
            <p class="text-[#8c8c88] font-light">Track and manage your curated collection.</p>
          </div>
          <a routerLink="/products" class="text-[10px] font-semibold text-[#3a3a35] uppercase tracking-[0.2em] hover:opacity-60 transition-opacity border-b border-[#3a3a35] pb-1">
            Back to Collection
          </a>
        </header>

        @if (loading()) {
          <div class="space-y-12">
            <div class="animate-pulse bg-white border border-[#e5e2dd] h-48"></div>
            <div class="animate-pulse bg-white border border-[#e5e2dd] h-48"></div>
          </div>
        } @else if (orders().length === 0) {
          <div class="text-center py-32 bg-white border border-[#e5e2dd]">
            <p class="text-[#8c8c88] uppercase tracking-[0.2em] text-xs">No orders discovered yet.</p>
          </div>
        } @else {
          <div class="space-y-8 md:space-y-16">
            @for (order of orders(); track order.id) {
              <div class="bg-white border border-[#e5e2dd] transition-all hover:border-[#3a3a35]/30">
                
                <!-- Header Info -->
                <div class="p-5 sm:p-8 md:p-10 border-b border-[#f1efe9] flex flex-col lg:flex-row lg:justify-between items-start gap-8">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full lg:w-auto">
                    <div>
                      <p class="text-[9px] font-semibold text-[#8c8c88] uppercase tracking-widest mb-3">Order Reference</p>
                      <p class="text-[#3a3a35] font-medium text-xs tracking-wider">#{{ order.id.substring(0, 10).toUpperCase() }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] font-semibold text-[#8c8c88] uppercase tracking-widest mb-3">Date</p>
                      <p class="text-[#3a3a35] text-xs font-light">{{ order.createdAt | date:'longDate' }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] font-semibold text-[#8c8c88] uppercase tracking-widest mb-3">Total Value</p>
                      <p class="text-[#3a3a35] font-medium text-xs">EGP {{ order.totalAmount | number:'1.2-2' }}</p>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-4 sm:gap-6">
                    <span [ngClass]="getStatusClass(order.status)" class="text-[9px] font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                      {{ order.status }}
                    </span>
                    @if (order.status === 'pending') {
                      <button 
                        (click)="cancelOrder(order.id)"
                        class="text-[9px] font-semibold text-red-800 uppercase tracking-widest border-b border-red-800/30 hover:border-red-800 transition-colors pb-0.5">
                        Cancel
                      </button>
                    }
                  </div>
                </div>

                <!-- Subtle Status Tracker -->
                <div class="px-5 sm:px-10 py-10 sm:py-12 bg-[#fcfbf9] overflow-x-auto">
                  <div class="relative flex justify-between min-w-[520px]">
                    <!-- Progress Line -->
                    <div class="absolute top-[7px] left-0 w-full h-[1px] bg-[#e5e2dd] z-0"></div>
                    <div [style.width]="getTrackingWidth(order.status)" class="absolute top-[7px] left-0 h-[1px] bg-[#3a3a35] z-0 transition-all duration-1000 ease-out"></div>

                    @for (step of trackingSteps; track step.key) {
                      <div class="relative z-10 flex flex-col items-center">
                        <div [ngClass]="isStepActive(order.status, step.key) ? 'bg-[#3a3a35] scale-110' : 'bg-[#e5e2dd]'"
                             class="w-[14px] h-[14px] rounded-full transition-all duration-700">
                        </div>
                        <p [ngClass]="isStepActive(order.status, step.key) ? 'text-[#3a3a35]' : 'text-[#c4c2be]'" 
                           class="mt-4 text-[9px] font-semibold uppercase tracking-[0.2em]">{{ step.label }}</p>
                      </div>
                    }
                  </div>
                </div>

                <!-- Order Item Summaries -->
                <div class="p-5 sm:p-8 md:p-10">
                   <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     @for (item of order.items; track item.productId.id) {
                       <div class="flex items-center gap-5 group">
                          <div class="w-14 h-16 bg-[#fbf9f6] flex-shrink-0">
                            <img [src]="item.productId.image || 'https://placehold.co/400'" [alt]="item.productId.name" class="w-full h-full object-cover grayscale-[0.2] mix-blend-multiply transition-transform group-hover:scale-105">
                          </div>
                          <div>
                            <p class="text-xs font-medium text-[#3a3a35] leading-snug">{{ item.productId.name }}</p>
                            <p class="text-[10px] text-[#8c8c88] uppercase tracking-wider mt-1.5">{{ item.quantity }} × EGP {{ item.price | number:'1.2-2' }}</p>
                          </div>
                       </div>
                     }
                   </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  orders = signal<any[]>([]);
  loading = signal(true);

  trackingSteps = [
    { key: 'pending', label: 'Placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' }
  ];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const user = this.authService.user();
    if (!user) return;

    this.orderService.getOrdersByUser(user.id).subscribe({
      next: (orders: any[]) => {
        this.orders.set(orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  cancelOrder(id: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(id).subscribe(() => this.loadOrders());
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'shipped': return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  getTrackingWidth(status: string) {
    switch (status) {
      case 'pending': return '0%';
      case 'processing': return '33%';
      case 'shipped': return '66%';
      case 'delivered': return '100%';
      default: return '0%';
    }
  }

  isStepActive(orderStatus: string, stepKey: string) {
    if (orderStatus === 'cancelled') return false;
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const statusIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(stepKey);
    return stepIndex <= statusIndex;
  }

  isStepCompleted(orderStatus: string, stepKey: string) {
    if (orderStatus === 'cancelled') return false;
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const statusIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(stepKey);
    return stepIndex < statusIndex || (statusIndex === 3 && stepIndex === 3);
  }
}
