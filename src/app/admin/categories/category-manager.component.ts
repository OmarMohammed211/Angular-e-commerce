import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../core/services/admin-data.service';
import { ModalComponent } from '../../shared/components/modal.component';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Categories</h1>
        <p class="text-slate-400 mt-1">Manage your product categories</p>
      </div>
      <button (click)="openAddModal()" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Category
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div *ngFor="let category of categories()" class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all shadow-sm group">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{{ category.name }}</h3>
          <div class="flex gap-2">
            <button (click)="openEditModal(category)" class="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button (click)="deleteCategory(category.id)" class="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p class="text-slate-400 text-sm line-clamp-2">{{ category.description }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div *ngIf="categories().length === 0" class="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="text-xl font-medium text-white mb-2">No categories found</h3>
      <p class="text-slate-400 mb-6">Get started by creating a new category.</p>
      <button (click)="openAddModal()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
        Create Category
      </button>
    </div>

    <!-- Modal -->
    <app-modal 
      [isOpen]="isModalOpen()" 
      [title]="modalTitle()"
      (closeModal)="closeModal()">
      
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <input 
            type="text" 
            formControlName="name" 
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g. Electronics">
          <div *ngIf="categoryForm.get('name')?.touched && categoryForm.get('name')?.invalid" class="text-red-400 text-xs mt-1">
            Name is required
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea 
            formControlName="description" 
            rows="3" 
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="A brief description of this category..."></textarea>
        </div>
        
        <div class="flex justify-end gap-3 mt-8">
          <button type="button" (click)="closeModal()" class="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
            Cancel
          </button>
          <button type="submit" [disabled]="categoryForm.invalid" class="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-medium transition-colors">
            {{ isEditing() ? 'Save Changes' : 'Create' }}
          </button>
        </div>
      </form>
    </app-modal>
  `
})
export class CategoryManagerComponent {
  private adminData = inject(AdminDataService);
  private fb = inject(FormBuilder);

  categories = this.adminData.categories;
  
  isModalOpen = signal(false);
  isEditing = signal(false);
  modalTitle = signal('Add Category');
  currentCategoryId: string | null = null;

  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  openAddModal() {
    this.isEditing.set(false);
    this.modalTitle.set('Add New Category');
    this.currentCategoryId = null;
    this.categoryForm.reset();
    this.isModalOpen.set(true);
  }

  openEditModal(category: Category) {
    this.isEditing.set(true);
    this.modalTitle.set('Edit Category');
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      
      if (this.isEditing() && this.currentCategoryId) {
        this.adminData.updateCategory({
          id: this.currentCategoryId,
          ...formValue
        });
      } else {
        this.adminData.addCategory(formValue);
      }
      this.closeModal();
    }
  }

  deleteCategory(id: string) {
    this.adminData.deleteCategory(id);
  }
}
