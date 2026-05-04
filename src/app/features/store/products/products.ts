import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product';
import { ProductCardComponent } from '../../../shared/product-card/product-card';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent {
  private productService = inject(ProductService);
  
  // State from Service converted to Signals[cite: 10]
  products = toSignal(this.productService.getProducts(), { initialValue: [] });
  categories = toSignal(this.productService.getCategories(), { initialValue: [] });

  // Local UI State Signals
  searchTerm = signal('');
  selectedCategory = signal('');

  // Derived state for the view
  filteredProducts = computed(() => {
    return this.products().filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesCat = this.selectedCategory() === '' || p.category === this.selectedCategory();
      return matchesSearch && matchesCat;
    });
  });
}