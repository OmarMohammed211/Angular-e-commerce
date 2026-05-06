import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  checkout(userId: string, shippingAddress: string) {
    return this.http.post<any>(`${this.apiUrl}/checkout`, { userId, shippingAddress });
  }

  getOrdersByUser(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(
        map((orders: any[]) => orders.map(o => this.mapOrder(o)))
      );
  }

  getAllOrders() {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        map((orders: any[]) => orders.map(o => this.mapOrder(o)))
      );
  }

  getOrderById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(o => this.mapOrder(o))
      );
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  cancelOrder(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancel`, {});
  }

  private mapOrder(o: any): any {
    return {
      id: o._id,
      user: o.userId, // Populated from 'userId' field by Mongoose
      items: o.items,
      totalAmount: o.totalAmount,
      status: o.status,
      shippingAddress: o.shippingAddress,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    };
  }
}
