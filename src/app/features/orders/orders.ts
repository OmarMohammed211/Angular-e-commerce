import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

// Temporary interface until the core/models are fully established
interface OrderPlaceholder {
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
  // Signals for state management, ready for the Data Lead to wire up to an OrderService
  readonly orders = signal<OrderPlaceholder[]>([]);
  readonly isLoading = signal<boolean>(false);

  // readonly hasOrders = computed(() => this.orders().length > 0);
}