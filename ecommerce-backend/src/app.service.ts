import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiDocs() {
    return {
      message: 'Welcome to the E-commerce API',
      version: '1.0.0',
      endpoints: {
        auth: [
          {
            path: '/auth/signup',
            method: 'POST',
            body: { name: 'string', email: 'string', password: 'string' },
          },
          {
            path: '/auth/signin',
            method: 'POST',
            body: { email: 'string', password: 'string' },
          },
        ],
        products: [
          {
            path: '/products',
            method: 'GET',
            description: 'Retrieve all products',
          },
          {
            path: '/products',
            method: 'POST',
            body: {
              name: 'string',
              description: 'string',
              price: 'number',
              stock: 'number',
            },
          },
          {
            path: '/products/:id',
            method: 'GET',
            description: 'Retrieve a single product',
          },
        ],
        cart: [
          {
            path: '/cart/add',
            method: 'POST',
            body: { userId: 'string', productId: 'string', quantity: 'number' },
          },
          {
            path: '/cart/:userId',
            method: 'GET',
            description: 'Get user cart contents',
          },
          {
            path: '/cart/remove/:userId/:productId',
            method: 'DELETE',
            description: 'Remove a specific item from cart',
          },
        ],
        users: [
          {
            path: '/api/users/:id',
            method: 'GET',
            description: 'Get user profile details',
          },
          {
            path: '/api/users/:id',
            method: 'PATCH',
            body: {
              name: 'string?',
              email: 'string?',
              address: 'string?',
              phone: 'string?',
            },
          },
          {
            path: '/api/users/:id',
            method: 'DELETE',
            description: 'Delete user account',
          },
        ],
        categories: [
          {
            path: '/categories',
            method: 'GET',
            description: 'Retrieve all categories',
          },
          {
            path: '/categories',
            method: 'POST',
            body: { name: 'string', description: 'string?', image: 'string?' },
          },
          {
            path: '/categories/:id',
            method: 'GET',
            description: 'Retrieve a single category',
          },
          {
            path: '/categories/:id',
            method: 'PATCH',
            body: { name: 'string?', description: 'string?', image: 'string?' },
          },
          {
            path: '/categories/:id',
            method: 'DELETE',
            description: 'Delete category',
          },
        ],
        orders: [
          {
            path: '/orders',
            method: 'GET',
            description: 'Retrieve all orders (Admin)',
          },
          {
            path: '/orders/checkout',
            method: 'POST',
            body: {
              userId: 'string',
              shippingAddress: 'string',
            },
            description: 'Convert user cart into a finalized order',
          },
          {
            path: '/orders/user/:userId',
            method: 'GET',
            description: 'Retrieve orders for a specific user',
          },
          {
            path: '/orders/:id',
            method: 'GET',
            description: 'Retrieve order details',
          },
          {
            path: '/orders/:id/status',
            method: 'PATCH',
            body: { status: 'string' },
            description: 'Update order status (Admin)',
          },
        ],
      },
    };
  }
}
