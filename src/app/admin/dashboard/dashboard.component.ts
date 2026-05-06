import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 class="text-4xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        <p class="text-slate-400 mt-2">Overview of your store's performance and activity.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div class="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-slate-400 text-sm font-medium">Total Revenue</p>
          <h3 class="text-2xl font-bold text-white mt-1">$ {{ totalRevenue() | number:'1.2-2' }}</h3>
        </div>

        <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div class="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p class="text-slate-400 text-sm font-medium">Total Orders</p>
          <h3 class="text-2xl font-bold text-white mt-1">{{ orders().length }}</h3>
        </div>

        <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div class="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p class="text-slate-400 text-sm font-medium">Total Products</p>
          <h3 class="text-2xl font-bold text-white mt-1">{{ products().length }}</h3>
        </div>

        <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div class="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-slate-400 text-sm font-medium">Active Categories</p>
          <h3 class="text-2xl font-bold text-white mt-1">{{ categoryCount() }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Orders -->
        <div class="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">Recent Orders</h3>
          </div>
          <div class="space-y-4">
            @for (order of orders().slice(0, 5); track order.id) {
              <div class="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-slate-400 text-xs">
                    #{{ order.id.slice(-4) }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-white">{{ order.user?.name || 'Customer' }}</p>
                    <p class="text-xs text-slate-500">{{ order.createdAt | date:'short' }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-white">$ {{ order.totalAmount }}</p>
                  <span [class]="getStatusClass(order.status)" class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                    {{ order.status }}
                  </span>
                </div>
              </div>
            } @empty {
              <p class="text-slate-500 text-center py-8">No orders found yet.</p>
            }
          </div>
        </div>

        <!-- Inventory Summary -->
        <div class="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">Low Stock Alert</h3>
            @if (lowStockProducts().length > 0) {
              <span class="px-2 py-1 bg-red-400/10 text-red-400 text-[10px] font-bold rounded-lg uppercase">Critical</span>
            }
          </div>
          <div class="space-y-4">
            @for (product of lowStockProducts(); track product.id) {
              <div class="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden">
                  <img [src]="product.imageUrl" class="w-full h-full object-cover" [alt]="product.name">
                </div>
                <div class="flex-grow">
                  <p class="text-sm font-bold text-white">{{ product.name }}</p>
                  <div class="w-full bg-slate-900 h-1.5 rounded-full mt-2">
                    <div [style.width.%]="(product.stock / 20) * 100" 
                         [class]="product.stock < 5 ? 'bg-red-500' : 'bg-amber-500'" 
                         class="h-full rounded-full transition-all duration-1000"></div>
                  </div>
                </div>
                <p [class]="product.stock < 5 ? 'text-red-400' : 'text-amber-400'" class="text-xs font-bold">
                  {{ product.stock }} Left
                </p>
              </div>
            } @empty {
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="text-white font-bold">Inventory Healthy</p>
                <p class="text-slate-500 text-sm">All products are well stocked.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);

  orders = toSignal(this.orderService.getAllOrders(), { initialValue: [] });
  products = toSignal(this.productService.getProducts(), { initialValue: [] });
  categoryCount = toSignal(this.productService.getCategories().pipe(map(c => c.length)), { initialValue: 0 });
  
  lowStockProducts = signal<any[]>([]);
  totalRevenue = signal(0);

  constructor() {
    // Calculate total revenue and low stock when data loads
    effect(() => {
      const allOrders = this.orders();
      const revenue = allOrders.reduce((acc, order) => acc + order.totalAmount, 0);
      this.totalRevenue.set(revenue);
    });

    effect(() => {
      const allProds = this.products();
      const lowStock = allProds.filter(p => p.stock < 10);
      this.lowStockProducts.set(lowStock);
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'delivered': return 'bg-emerald-400/10 text-emerald-400';
      case 'shipped': return 'bg-blue-400/10 text-blue-400';
      case 'processing': return 'bg-amber-400/10 text-amber-400';
      default: return 'bg-slate-400/10 text-slate-400';
    }
  }
}
