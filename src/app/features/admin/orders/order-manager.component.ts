import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p class="text-sm text-gray-500 mt-1">Review and fulfill customer orders.</p>
        </div>
        <div class="flex gap-2 border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
          <button class="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-900">All</button>
          <button class="px-3 py-1 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900 transition-colors">Pending</button>
          <button class="px-3 py-1 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900 transition-colors">Shipped</button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[860px] text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order / Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let order of orders()" class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <p class="font-medium text-gray-900">#{{ order.id.substring(0, 8).toUpperCase() }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ order.createdAt | date:'medium' }}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-medium text-gray-900">{{ order.user?.name || 'Guest' }}</p>
                  <p class="text-xs text-gray-500">{{ order.user?.email || order.shippingAddress }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-gray-900">EGP {{ order.totalAmount | number:'1.2-2' }}</span>
                  <p class="text-[10px] text-gray-400 mt-0.5">{{ order.items.length }} items</p>
                </td>
                <td class="px-6 py-4">
                  <div class="relative">
                    <select 
                      [value]="order.status" 
                      (change)="updateStatus(order.id, $event)"
                      class="appearance-none bg-transparent border-0 py-1 pl-2.5 pr-8 rounded-full text-xs font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                      [ngClass]="{
                        'bg-yellow-50 text-yellow-700 hover:bg-yellow-100': order.status === 'pending',
                        'bg-blue-50 text-blue-700 hover:bg-blue-100': order.status === 'processing',
                        'bg-purple-50 text-purple-700 hover:bg-purple-100': order.status === 'shipped',
                        'bg-emerald-50 text-emerald-700 hover:bg-emerald-100': order.status === 'delivered',
                        'bg-red-50 text-red-700 hover:bg-red-100': order.status === 'cancelled'
                      }">
                      <option value="pending">PENDING</option>
                      <option value="processing">PROCESSING</option>
                      <option value="shipped">SHIPPED</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                    <!-- Custom select arrow -->
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <button (click)="openOrderDetails(order)" class="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 hover:bg-blue-50 rounded-lg">
                    View Details
                  </button>
                </td>
              </tr>
              <tr *ngIf="orders().length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  No orders found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div *ngIf="isModalOpen()" class="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style="z-index: 9999; background-color: rgba(0, 0, 0, 0.75);">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col" style="z-index: 10000; max-height: 90vh;">
          <!-- Modal Header -->
          <div class="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Order Details</h3>
              <p class="text-sm text-gray-500 mt-0.5">Order #{{ selectedOrder()?.id?.substring(0, 8)?.toUpperCase() }}</p>
            </div>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-all">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-5 sm:p-8 overflow-y-auto space-y-8">
            <!-- Customer & Shipping Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h4>
                <div class="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <p class="text-sm font-semibold text-gray-900">{{ selectedOrder()?.user?.name || 'Guest Customer' }}</p>
                  <p class="text-sm text-gray-600">{{ selectedOrder()?.user?.email }}</p>
                </div>
              </div>
              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</h4>
                <div class="bg-gray-50 rounded-2xl p-4">
                  <p class="text-sm text-gray-600 leading-relaxed">{{ selectedOrder()?.shippingAddress }}</p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div>
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items</h4>
              <div class="border border-gray-100 rounded-2xl overflow-x-auto">
                <table class="w-full min-w-[520px] text-left">
                  <thead class="bg-gray-50/50">
                    <tr>
                      <th class="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product</th>
                      <th class="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Qty</th>
                      <th class="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Price</th>
                      <th class="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr *ngFor="let item of selectedOrder()?.items">
                      <td class="px-4 py-4">
                        <p class="text-sm font-medium text-gray-900">{{ item.productId.name }}</p>
                      </td>
                      <td class="px-4 py-4 text-center">
                        <span class="text-sm text-gray-600">{{ item.quantity }}</span>
                      </td>
                      <td class="px-4 py-4 text-right">
                        <span class="text-sm text-gray-600">EGP {{ item.price | number:'1.2-2' }}</span>
                      </td>
                      <td class="px-4 py-4 text-right">
                        <span class="text-sm font-semibold text-gray-900">EGP {{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Summary -->
            <div class="flex justify-end pt-4 border-t border-gray-100">
              <div class="w-full max-w-[240px] space-y-3">
                <div class="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>EGP {{ selectedOrder()?.totalAmount | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span class="text-emerald-600 font-medium">Free</span>
                </div>
                <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span class="text-base font-bold text-gray-900">Order Total</span>
                  <span class="text-xl font-black text-gray-900">EGP {{ selectedOrder()?.totalAmount | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button (click)="closeModal()" class="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all">
              Close Window
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class OrderManagerComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isModalOpen = signal(false);
  selectedOrder = signal<Order | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data: Order[]) => this.orders.set(data),
      error: (err) => console.error('Error loading orders', err)
    });
  }

  openOrderDetails(order: Order) {
    this.selectedOrder.set(order);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedOrder.set(null);
  }

  updateStatus(orderId: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as Order['status'];
    
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        // Optimistically update the signal
        const updatedOrders = this.orders().map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        );
        this.orders.set(updatedOrders);
        
        // If the selected order is the one being updated, update it too
        if (this.selectedOrder()?.id === orderId) {
          this.selectedOrder.set({ ...this.selectedOrder()!, status: newStatus });
        }
      },
      error: (err) => {
        console.error('Error updating order status', err);
        // Re-load on error to revert
        this.loadOrders();
      }
    });
  }
}
