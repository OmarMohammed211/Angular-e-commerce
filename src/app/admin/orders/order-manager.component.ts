import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Order Management</h1>
          <p class="text-slate-400 mt-1">Monitor and update customer orders.</p>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-950/50">
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr *ngFor="let order of orders()" class="hover:bg-slate-800/30 transition-colors group">
                <td class="px-6 py-4">
                  <span class="font-mono text-xs text-blue-400">#{{ order.id.substring(0, 12) }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-white font-medium">{{ order.userId.name }}</span>
                    <span class="text-slate-500 text-xs">{{ order.userId.email }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-400 text-sm">
                  {{ order.createdAt | date:'short' }}
                </td>
                <td class="px-6 py-4 font-bold text-white">
                  $ {{ order.totalAmount }}
                </td>
                <td class="px-6 py-4">
                  <span [ngClass]="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <select 
                      #statusSelect
                      (change)="updateStatus(order.id, statusSelect.value)"
                      class="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-600">
                      <option value="" disabled selected>Update Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="loading()" class="p-12 text-center text-slate-500">
          Loading orders...
        </div>
        
        <div *ngIf="!loading() && orders().length === 0" class="p-12 text-center text-slate-500 italic">
          No orders found.
        </div>
      </div>
    </div>
  `
})
export class OrderManagerComponent implements OnInit {
  private orderService = inject(OrderService);
  
  orders = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getAllOrders().subscribe({
      next: (orders: any[]) => {
        this.orders.set(orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  updateStatus(id: string, status: string) {
    this.orderService.updateOrderStatus(id, status).subscribe(() => this.loadOrders());
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
}
