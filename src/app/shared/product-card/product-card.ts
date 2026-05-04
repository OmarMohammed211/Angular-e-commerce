// src/app/shared/product-card/product-card.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/store.models';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="card">
      <img [src]="product.thumbnail" [alt]="product.title" loading="lazy">
      <div class="content">
        <h3>{{ product.title }}</h3>
        <p class="price">{{ product.price | currency }}</p>
        <div class="actions">
          <a [routerLink]="['/products', product.id]" class="btn-view">Details</a>
          <button (click)="cart.addToCart(product)" class="btn-add">Add to Cart</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  cart = inject(CartService);
}