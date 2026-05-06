import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" (click)="close()"></div>
      
      <!-- Modal Panel -->
      <div class="relative w-full max-w-md mx-auto my-6 z-50">
        <!-- Content -->
        <div class="relative flex flex-col w-full bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl outline-none focus:outline-none">
          <!-- Header -->
          <div class="flex items-start justify-between p-5 border-b border-slate-800 rounded-t-2xl">
            <h3 class="text-xl font-semibold text-white">
              {{ title }}
            </h3>
            <button 
              class="p-1 ml-auto bg-transparent border-0 text-slate-400 hover:text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors"
              (click)="close()">
              <span class="text-2xl block outline-none focus:outline-none">×</span>
            </button>
          </div>
          <!-- Body -->
          <div class="relative p-6 flex-auto text-slate-300">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Modal Title';
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
