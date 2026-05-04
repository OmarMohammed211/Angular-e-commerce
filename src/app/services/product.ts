// src/app/services/product.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Product } from '../models/store.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private mockProducts: Product[] = [
    { id: 1, title: 'iPhone 15', description: 'Latest Apple smartphone', category: 'smartphones', price: 999, discountPercentage: 10, rating: 4.8, stock: 50, brand: 'Apple', thumbnail: 'https://placehold.co/400x400?text=iPhone+15', images: [] },
    { id: 2, title: 'Samsung S24', description: 'AI powered flagship', category: 'smartphones', price: 899, discountPercentage: 5, rating: 4.7, stock: 30, brand: 'Samsung', thumbnail: 'https://placehold.co/400x400?text=S24', images: [] },
    { id: 3, title: 'MacBook Pro', description: 'M3 Chip powerhouse', category: 'laptops', price: 1999, discountPercentage: 12, rating: 4.9, stock: 15, brand: 'Apple', thumbnail: 'https://placehold.co/400x400?text=MacBook', images: [] },
    // ... add more mock items as needed
  ];

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(800)); // Simulate network lag
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(500));
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockProducts.map(p => p.category))];
    return of(categories).pipe(delay(300));
  }
}