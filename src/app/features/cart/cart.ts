import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageAlt: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe]
})
export class Cart {
  // Dummy data for UI/UX Lead to style.
  readonly cartItems = signal<CartItem[]>([
    { id: '1', name: 'Wireless Headphones', price: 199.99, quantity: 1, imageAlt: 'Black wireless headphones' },
    { id: '2', name: 'Mechanical Keyboard', price: 129.50, quantity: 2, imageAlt: 'RGB mechanical keyboard' }
  ]);

  readonly subtotal = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  readonly tax = computed(() => this.subtotal() * 0.08); // 8% tax
  readonly total = computed(() => this.subtotal() + this.tax());
  readonly isEmpty = computed(() => this.cartItems().length === 0);

  updateQuantity(id: string, delta: number): void {
    this.cartItems.update(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }

  removeItem(id: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }
}