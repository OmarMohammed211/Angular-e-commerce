import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';


@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Product Management</h1>
          <p class="text-sm text-gray-500 mt-1">Create, update, and remove products from the catalog.</p>
        </div>
        <button (click)="openForm()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Product
        </button>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let product of products()" class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      <img [src]="product.imageUrl" [alt]="product.name" class="h-full w-full object-cover">
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                      <p class="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{{ product.id.substring(0, 8) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-gray-900">EGP {{ product.price | number:'1.2-2' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        [ngClass]="product.stock > 10 ? 'bg-emerald-50 text-emerald-700' : (product.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700')">
                    {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="openForm(product)" class="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button (click)="deleteProduct(product.id)" class="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="products().length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  No products found. Start by adding one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bulletproof Modal -->
      <div *ngIf="isFormOpen()" class="fixed inset-0 flex items-center justify-center p-4" style="z-index: 9999; background-color: rgba(0, 0, 0, 0.75);">
        <!-- Modal Card -->
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col mx-4" style="z-index: 10000; max-height: 90vh;">
          <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="flex flex-col h-full">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 class="text-xl font-bold text-gray-900">
                {{ editingId() ? 'Edit Product' : 'Add New Product' }}
              </h3>
              <button type="button" (click)="closeForm()" class="text-gray-400 hover:text-gray-600">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" formControlName="name" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Price (EGP)</label>
                  <input type="number" formControlName="price" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" formControlName="stock" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select formControlName="categoryId" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">No Category</option>
                  <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" formControlName="imageUrl" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea formControlName="description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-row-reverse gap-3">
              <button type="submit" [disabled]="!productForm.valid || isSaving()" 
                      class="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50">
                {{ isSaving() ? 'Saving...' : 'Save Product' }}
              </button>
              <button type="button" (click)="closeForm()" class="px-6 py-2 border border-gray-300 rounded-xl hover:bg-white bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
  `
})
export class ProductManagerComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  
  isFormOpen = signal(false);
  isSaving = signal(false);
  editingId = signal<string | null>(null);

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: [''],
    imageUrl: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error loading products', err)
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error loading categories', err)
    });
  }


  openForm(product?: Product) {
    console.log('Opening form for product:', product);
    if (product) {
      this.editingId.set(product.id);
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        description: product.description
      });
    } else {
      this.editingId.set(null);
      this.productForm.reset({ price: 0, stock: 0 });
    }
    this.isFormOpen.set(true);
  }


  closeForm() {
    this.isFormOpen.set(false);
    this.editingId.set(null);
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.productForm.value;
    const id = this.editingId();

    if (id) {
      this.productService.updateProduct(id, formValue).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false)
      });
    } else {
      this.productService.createProduct(formValue).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false)
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }
}
