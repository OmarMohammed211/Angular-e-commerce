import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCategories() {
    return this.http.get<any[]>(`${this.apiUrl}/categories`)
      .pipe(
        map(cats => cats.map(c => ({
          id: c._id,
          name: c.name,
          description: c.description,
          imageUrl: c.image
        } as Category)))

      );
  }

  getProducts(categoryId?: string) {
    const url = categoryId 
      ? `${this.apiUrl}/products/category/${categoryId}`
      : `${this.apiUrl}/products`;
      
    return this.http.get<any[]>(url)
      .pipe(
        map(prods => prods.map(p => this.mapProduct(p)))
      );
  }

  getProductById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`)
      .pipe(
        map(p => this.mapProduct(p))
      );
  }

  searchProducts(query: string) {
    return this.http.get<any[]>(`${this.apiUrl}/products/search?q=${query}`)
      .pipe(
        map(prods => prods.map(p => this.mapProduct(p)))
      );
  }

  createProduct(product: Partial<Product>) {
    // Map standard fields back to backend expected fields
    const payload = {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      stock: product.stock,
      categoryId: product.categoryId || null
    };
    return this.http.post<any>(`${this.apiUrl}/products`, payload)
      .pipe(map(p => this.mapProduct(p)));
  }

  updateProduct(id: string, product: Partial<Product>) {
    const payload = {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      stock: product.stock,
      categoryId: product.categoryId || null
    };
    return this.http.patch<any>(`${this.apiUrl}/products/${id}`, payload)
      .pipe(map(p => this.mapProduct(p)));
  }


  deleteProduct(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // Category Management
  createCategory(category: any) {
    return this.http.post<any>(`${this.apiUrl}/categories`, {
      name: category.name,
      description: category.description,
      image: category.imageUrl
    });
  }

  updateCategory(id: string, category: any) {
    return this.http.patch<any>(`${this.apiUrl}/categories/${id}`, {
      name: category.name,
      description: category.description,
      image: category.imageUrl
    });
  }

  deleteCategory(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }



  private mapProduct(p: any): Product {
    return {
      id: p._id,
      categoryId: p.categoryId,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.image || 'https://placehold.co/400',
      stock: p.stock
    };
  }
}
