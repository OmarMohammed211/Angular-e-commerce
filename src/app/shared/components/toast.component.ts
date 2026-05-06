import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-4 z-[100] flex flex-col gap-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          [class]="getToastClass(toast.type)"
          class="min-w-[300px] p-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-8 duration-300 flex items-center justify-between">
          <div class="flex items-center gap-3">
            @if (toast.type === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            }
            <span class="text-sm font-bold text-white">{{ toast.message }}</span>
          </div>
          <button (click)="toastService.remove(toast.id)" class="text-white/40 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClass(type: string) {
    switch (type) {
      case 'success': return 'bg-emerald-950/80 border-emerald-500/50 backdrop-blur-md';
      case 'error': return 'bg-red-950/80 border-red-500/50 backdrop-blur-md';
      default: return 'bg-slate-900/80 border-slate-700/50 backdrop-blur-md';
    }
  }
}
