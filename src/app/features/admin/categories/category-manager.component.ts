import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Category Management</h1>
          <p class="text-sm text-gray-500 mt-1">Organize your products into logical groups.</p>
        </div>
        <button (click)="openForm()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Category
        </button>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let cat of categories()" class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      <img [src]="$any(cat).imageUrl || 'https://placehold.co/100'" [alt]="cat.name" class="h-full w-full object-cover">
                    </div>

                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ cat.name }}</p>
                      <p class="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{{ cat.id.substring(0, 8) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-500 truncate max-w-xs">{{ cat.description }}</p>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="openForm(cat)" class="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button (click)="deleteCategory(cat.id)" class="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="categories().length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                  No categories found. Start by adding one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="isFormOpen()" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" (click)="closeForm()"></div>

        <!-- Modal Content -->
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 relative z-[110] transform transition-all overflow-hidden border border-gray-200">
          <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
            <div class="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
              <h3 class="text-xl font-bold text-gray-900">
                {{ editingId() ? 'Edit Category' : 'Add New Category' }}
              </h3>
            </div>

            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input type="text" formControlName="name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" formControlName="imageUrl" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea formControlName="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"></textarea>
              </div>
            </div>

            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-row-reverse gap-3">
              <button type="submit" [disabled]="!categoryForm.valid || isSaving()" 
                      class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                {{ isSaving() ? 'Saving...' : 'Save Category' }}
              </button>
              <button type="button" (click)="closeForm()" 
                      class="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
  `
})
export class CategoryManagerComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  isFormOpen = signal(false);
  isSaving = signal(false);
  editingId = signal<string | null>(null);

  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    imageUrl: [''],
    description: ['']
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error loading categories', err)
    });
  }

  openForm(category?: Category) {
    if (category) {
      this.editingId.set(category.id);
      this.categoryForm.patchValue({
        name: category.name,
        imageUrl: (category as any).imageUrl,
        description: category.description

      });
    } else {
      this.editingId.set(null);
      this.categoryForm.reset();
    }
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.editingId.set(null);
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.categoryForm.value;
    const id = this.editingId();

    if (id) {
      this.productService.updateCategory(id, formValue).subscribe({
        next: () => {
          this.loadCategories();
          this.closeForm();
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false)
      });
    } else {
      this.productService.createCategory(formValue).subscribe({
        next: () => {
          this.loadCategories();
          this.closeForm();
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false)
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Error deleting category', err)
      });
    }
  }
}
