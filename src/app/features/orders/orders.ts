import { Component, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';

// Temporary interface until the core/models are fully established
interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class Orders {
  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(true);

  readonly hasOrders = computed(() => this.orders().length > 0);

  ngOnInit() {
    // Simulate API fetch delay to view the Tailwind loading spinner
    setTimeout(() => {
      this.orders.set([
        { id: 'ORD-001', date: '2026-05-01', total: 129.99, status: 'completed' },
        { id: 'ORD-002', date: '2026-05-04', total: 49.50, status: 'pending' },
        { id: 'ORD-003', date: '2026-04-15', total: 89.00, status: 'cancelled' },
      ]);
      this.isLoading.set(false);
    }, 1000);
  }
}