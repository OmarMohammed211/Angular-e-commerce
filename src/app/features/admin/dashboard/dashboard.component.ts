import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],

  template: `
    <div class="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p class="text-gray-500 mt-1">Welcome back. Here's what's happening with your store today.</p>
        </div>
        <button class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Export Report
        </button>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <a routerLink="/admin/products" class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 transition-all group">
          <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-900">Manage Products</h4>
          <p class="text-xs text-gray-500 mt-1">Add, edit or remove products from catalog.</p>
        </a>

        <a routerLink="/admin/categories" class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-all group">
          <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-900">Manage Collections</h4>
          <p class="text-xs text-gray-500 mt-1">Organize products into editorial collections.</p>
        </a>

        <a routerLink="/admin/orders" class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 transition-all group">
          <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h4 class="font-bold text-gray-900">Review Orders</h4>
          <p class="text-xs text-gray-500 mt-1">Fulfill pending customer orders.</p>
        </a>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <!-- Revenue -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              12.5%
            </span>
          </div>
          <p class="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
          <h3 class="text-3xl font-bold text-gray-900">EGP {{ totalRevenue() | number:'1.2-2' }}</h3>
        </div>

        <!-- Orders -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              8.2%
            </span>
          </div>
          <p class="text-gray-500 text-sm font-medium mb-1">Total Orders</p>
          <h3 class="text-3xl font-bold text-gray-900">{{ orders().length }}</h3>
        </div>

        <!-- Products -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <p class="text-gray-500 text-sm font-medium mb-1">Active Products</p>
          <h3 class="text-3xl font-bold text-gray-900">{{ totalProducts() }}</h3>
        </div>

        <!-- Customers -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              2.1%
            </span>
          </div>
          <p class="text-gray-500 text-sm font-medium mb-1">New Customers</p>
          <h3 class="text-3xl font-bold text-gray-900">48</h3>
        </div>
      </div>


      <!-- Recent Orders Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900">Recent Orders</h3>
          <a routerLink="/admin/orders" class="text-sm font-medium text-blue-600 hover:text-blue-700">View all</a>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let order of recentOrders()" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <span class="font-medium text-gray-900">#{{ order.id.substring(0, 8) }}</span>
                </td>
                <td class="px-6 py-4 text-gray-500">
                  {{ order.createdAt | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                        [ngClass]="{
                          'bg-yellow-50 text-yellow-700': order.status === 'pending',
                          'bg-blue-50 text-blue-700': order.status === 'processing',
                          'bg-purple-50 text-purple-700': order.status === 'shipped',
                          'bg-emerald-50 text-emerald-700': order.status === 'delivered',
                          'bg-red-50 text-red-700': order.status === 'cancelled'
                        }">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-medium text-gray-900">
                  EGP {{ order.totalAmount | number:'1.2-2' }}
                </td>
              </tr>
              <tr *ngIf="recentOrders().length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);

  orders = signal<Order[]>([]);
  recentOrders = signal<Order[]>([]);
  totalRevenue = signal<number>(0);
  totalProducts = signal<number>(0);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load Orders
    this.orderService.getAllOrders().subscribe({
      next: (data: Order[]) => {
        this.orders.set(data);
        this.recentOrders.set(data.slice(0, 5)); // Just take first 5
        
        // Calc revenue
        const revenue = data.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
        this.totalRevenue.set(revenue);
      }
    });

    // Load Products count
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.totalProducts.set(data.length);
      }
    });
  }
}
