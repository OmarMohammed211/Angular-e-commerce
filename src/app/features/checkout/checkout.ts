import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class Checkout {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly isSubmitting = signal<boolean>(false);

  // Reactive Form Setup
  readonly checkoutForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
  });

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Simulate API call for the Data Lead
    setTimeout(() => {
      this.isSubmitting.set(false);
      // Route to a success page or orders page after completion
      this.router.navigate(['/orders']);
    }, 1500);
  }

  // Helper for template validation styling
  isInvalid(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}