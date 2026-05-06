import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  private _categories = signal<Category[]>([]);
  private _products = signal<Product[]>([]);

  // Exposed Signals
  categories = this._categories.asReadonly();
  products = this._products.asReadonly();

  constructor() {
    this.loadCategories();
    this.loadProducts();
  }

  // Load Data
  private loadCategories() {
    this.http.get<any[]>(`${this.apiUrl}/categories`)
      .pipe(
        map(cats => cats.map(c => ({
          id: c._id,
          name: c.name,
          description: c.description,
          imageUrl: c.image
        })))

      )
      .subscribe(categories => this._categories.set(categories));
  }

  private loadProducts() {
    this.http.get<any[]>(`${this.apiUrl}/products`)
      .pipe(
        map(prods => prods.map(p => ({
          id: p._id,
          categoryId: p.categoryId,
          name: p.name,
          price: p.price,
          description: p.description,
          imageUrl: p.image || 'https://placehold.co/400',
          stock: p.stock
        })))
      )
      .subscribe(products => this._products.set(products));
  }

  // Categories CRUD
  addCategory(category: Omit<Category, 'id'>) {
    this.http.post<any>(`${this.apiUrl}/categories`, category)
      .subscribe(newCat => {
        const cat = { id: newCat._id, ...category };
        this._categories.update(categories => [...categories, cat as Category]);
      });
  }

  updateCategory(updatedCategory: Category) {
    const { id, ...data } = updatedCategory;
    this.http.patch<any>(`${this.apiUrl}/categories/${id}`, data)
      .subscribe(() => {
        this._categories.update(categories =>
          categories.map(c => c.id === id ? updatedCategory : c)
        );
      });
  }

  deleteCategory(id: string) {
    this.http.delete(`${this.apiUrl}/categories/${id}`)
      .subscribe(() => {
        this._categories.update(categories => categories.filter(c => c.id !== id));
        this._products.update(products => products.filter(p => p.categoryId !== id));
      });
  }

  // Products CRUD
  addProduct(product: Omit<Product, 'id'>) {
    const { imageUrl, ...data } = product as any;
    const backendData = { ...data, image: imageUrl };
    
    this.http.post<any>(`${this.apiUrl}/products`, backendData)
      .subscribe(newProd => {
        const prod = { id: newProd._id, ...product };
        this._products.update(products => [...products, prod as Product]);
      });
  }

  updateProduct(updatedProduct: Product) {
    const { id, imageUrl, ...data } = updatedProduct as any;
    const backendData = { ...data, image: imageUrl };

    this.http.patch<any>(`${this.apiUrl}/products/${id}`, backendData)
      .subscribe(() => {
        this._products.update(products =>
          products.map(p => p.id === id ? updatedProduct : p)
        );
      });
  }

  deleteProduct(id: string) {
    this.http.delete(`${this.apiUrl}/products/${id}`)
      .subscribe(() => {
        this._products.update(products => products.filter(p => p.id !== id));
      });
  }
}
