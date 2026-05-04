/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items, ...rest } = createOrderDto;
    
    const orderData = {
      ...rest,
      userId: new Types.ObjectId(userId),
      items: items.map(item => ({
        ...item,
        productId: new Types.ObjectId(item.productId),
      })),
    };

    const createdOrder = new this.orderModel(orderData);
    const savedOrder = await createdOrder.save();

    // Clear user's cart after order is placed
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
