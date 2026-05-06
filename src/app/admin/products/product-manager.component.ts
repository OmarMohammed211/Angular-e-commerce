import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../core/services/admin-data.service';
import { ModalComponent } from '../../shared/components/modal.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent],
  template: `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Products</h1>
        <p class="text-slate-400 mt-1">Manage inventory across categories</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <select 
          [ngModel]="selectedCategoryId()" 
          (ngModelChange)="onCategoryChange($event)"
          class="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full sm:w-64">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
        </select>
        
        <button (click)="openAddModal()" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Product
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm font-medium uppercase tracking-wider">
              <th class="px-6 py-4">Product</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Price</th>
              <th class="px-6 py-4">Stock</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 text-slate-300">
            <tr *ngFor="let product of filteredProducts()" class="hover:bg-slate-800/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-700">
                    <img [src]="product.imageUrl" [alt]="product.name" class="h-full w-full object-cover">
                  </div>
                  <div>
                    <div class="font-medium text-white">{{ product.name }}</div>
                    <div class="text-sm text-slate-500 line-clamp-1">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {{ getCategoryName(product.categoryId) }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium">$ {{ product.price }}</td>
              <td class="px-6 py-4">
                <span [class]="product.stock > 10 ? 'text-emerald-400' : 'text-amber-400'">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button (click)="openEditModal(product)" class="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button (click)="deleteProduct(product.id)" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredProducts().length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>No products found matching your criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <app-modal 
      [isOpen]="isModalOpen()" 
      [title]="modalTitle()"
      (closeModal)="closeModal()">
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-300 mb-1">Product Name</label>
            <input 
              type="text" 
              formControlName="name" 
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Wireless Headphones">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select 
              formControlName="categoryId" 
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
              <option value="" disabled>Select a category</option>
              <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Price ($)</label>
            <input 
              type="number" 
              formControlName="price" 
              min="0" step="0.01"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Stock Quantity</label>
            <input 
              type="number" 
              formControlName="stock" 
              min="0" step="1"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Image URL</label>
            <input 
              type="text" 
              formControlName="imageUrl" 
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg">
          </div>
          
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea 
              formControlName="description" 
              rows="3" 
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Product details..."></textarea>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
          <button type="button" (click)="closeModal()" class="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
            Cancel
          </button>
          <button type="submit" [disabled]="productForm.invalid" class="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-medium transition-colors">
            {{ isEditing() ? 'Save Changes' : 'Create Product' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class ProductManagerComponent {
  private adminData = inject(AdminDataService);
  private fb = inject(FormBuilder);

  categories = this.adminData.categories;
  products = this.adminData.products;
  
  selectedCategoryId = signal<string>('');
  
  filteredProducts = computed(() => {
    const categoryId = this.selectedCategoryId();
    const allProducts = this.products();
    if (!categoryId) return allProducts;
    return allProducts.filter(p => p.categoryId === categoryId);
  });
  
  isModalOpen = signal(false);
  isEditing = signal(false);
  modalTitle = signal('Add Product');
  currentProductId: string | null = null;

  productForm: FormGroup = this.fb.group({
    categoryId: ['', Validators.required],
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    imageUrl: ['https://placehold.co/400'],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  onCategoryChange(categoryId: string) {
    this.selectedCategoryId.set(categoryId);
  }

  getCategoryName(id: string): string {
    const category = this.categories().find(c => c.id === id);
    return category ? category.name : 'Unknown';
  }

  openAddModal() {
    this.isEditing.set(false);
    this.modalTitle.set('Add New Product');
    this.currentProductId = null;
    this.productForm.reset({
      categoryId: this.selectedCategoryId() || '',
      price: 0,
      stock: 0,
      imageUrl: 'https://placehold.co/400'
    });
    this.isModalOpen.set(true);
  }

  openEditModal(product: Product) {
    this.isEditing.set(true);
    this.modalTitle.set('Edit Product');
    this.currentProductId = product.id;
    this.productForm.patchValue({
      categoryId: product.categoryId,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      
      if (this.isEditing() && this.currentProductId) {
        this.adminData.updateProduct({
          id: this.currentProductId,
          ...formValue
        });
      } else {
        this.adminData.addProduct(formValue);
      }
      this.closeModal();
    }
  }

  deleteProduct(id: string) {
    this.adminData.deleteProduct(id);
  }
}
