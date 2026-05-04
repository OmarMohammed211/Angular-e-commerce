import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  // Mock Data Initialization
  private _categories = signal<Category[]>([
    { id: '1', name: 'Electronics', description: 'Gadgets and devices' },
    { id: '2', name: 'Clothing', description: 'Apparel and accessories' }
  ]);

  private _products = signal<Product[]>([
    { id: '101', categoryId: '1', name: 'Smartphone', price: 699, description: 'Latest model smartphone', imageUrl: 'https://placehold.co/400', stock: 50 },
    { id: '102', categoryId: '1', name: 'Laptop', price: 1200, description: 'High performance laptop', imageUrl: 'https://placehold.co/400', stock: 30 },
    { id: '103', categoryId: '2', name: 'T-Shirt', price: 20, description: 'Cotton t-shirt', imageUrl: 'https://placehold.co/400', stock: 100 }
  ]);

  // Exposed Signals
  categories = this._categories.asReadonly();
  products = this._products.asReadonly();

  // Categories CRUD
  addCategory(category: Omit<Category, 'id'>) {
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).substr(2, 9)
    };
    this._categories.update(categories => [...categories, newCategory]);
  }

  updateCategory(updatedCategory: Category) {
    this._categories.update(categories =>
      categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
    );
  }

  deleteCategory(id: string) {
    this._categories.update(categories => categories.filter(c => c.id !== id));
    // Cascade delete products
    this._products.update(products => products.filter(p => p.categoryId !== id));
  }

  // Products CRUD
  getProductsByCategory(categoryId: string) {
    return computed(() => this._products().filter(p => p.categoryId === categoryId));
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9)
    };
    this._products.update(products => [...products, newProduct]);
  }

  updateProduct(updatedProduct: Product) {
    this._products.update(products =>
      products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  }

  deleteProduct(id: string) {
    this._products.update(products => products.filter(p => p.id !== id));
  }
}
