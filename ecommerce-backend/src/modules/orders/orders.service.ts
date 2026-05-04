/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';

interface PopulatedCartItem {
  productId: {
    _id: Types.ObjectId;
    price: number;
  };
  quantity: number;
}

interface CartResponse {
  userId: Types.ObjectId;
  items: PopulatedCartItem[];
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
  ) {}

  async checkout(userId: string, shippingAddress: string): Promise<Order> {
    // 1. Fetch user's cart
    const cart = (await this.cartService.getCart(userId)) as unknown as CartResponse;
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // 2. Prepare order items and calculate total
    let totalAmount = 0;
    const orderItems = cart.items.map(
      (item) => {
        const price = item.productId.price;
        const quantity = item.quantity;
        totalAmount += price * quantity;

        return {
          productId: item.productId._id,
          quantity,
          price, // Snapshot of current price
        };
      },
    );

    // 3. Create the order
    const orderData = {
      userId: new Types.ObjectId(userId),
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
    };

    const createdOrder = new this.orderModel(orderData);
    const savedOrder = await createdOrder.save();

    // 4. Clear the cart
    await this.cartService.emptyCart(userId);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find()
      .populate('userId', 'name email') // Only name and email
      .populate('items.productId', 'name price') // Only name and price
      .lean()
      .exec();
  }

  async findByUser(userId: string): Promise<Order[]> {
    return await this.orderModel.find({ userId: new Types.ObjectId(userId) })
      .populate('items.productId', 'name price')
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .lean()
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
