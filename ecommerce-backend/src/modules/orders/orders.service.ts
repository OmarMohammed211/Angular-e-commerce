/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

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

interface LocalOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

@Injectable()
export class OrdersService {
  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  async checkout(userId: string, shippingAddress: string): Promise<Order> {
    // 1. Fetch user's cart from MongoDB
    const cart = (await this.cartService.getCart(userId)) as unknown as CartResponse;
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // 2. Prepare order items, calculate total, and CHECK STOCK
    const productIds = cart.items.map(item => item.productId._id.toString());
    const products = await this.productsService.findMany(productIds);
    
    const productMap = new Map(products.map(p => [(p as { _id: Types.ObjectId })._id.toString(), p]));
    
    let totalAmount = 0;
    const orderItems: LocalOrderItem[] = [];

    for (const item of cart.items) {
      const product = productMap.get(item.productId._id.toString());
      
      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId._id.toString()}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
      }

      const price = product.price;
      const quantity = item.quantity;
      if (quantity <= 0) {
        throw new BadRequestException(`Invalid quantity for product: ${product.name}`);
      }

      totalAmount += price * quantity;

      orderItems.push({
        productId: item.productId._id,
        quantity,
        price,
      });
    }

    totalAmount = Math.round(totalAmount * 100) / 100;

    // 3. Decrement stock atomically before saving the order.
    // If saving fails, restore any stock changes below.
    const decrementedItems: LocalOrderItem[] = [];
    try {
      for (const item of orderItems) {
        await this.productsService.decrementStock(item.productId.toString(), item.quantity);
        decrementedItems.push(item);
      }
    } catch (error) {
      for (const item of decrementedItems) {
        await this.productsService.updateStock(item.productId.toString(), item.quantity);
      }
      throw error;
    }

    // 4. Create the order using backend-calculated prices and total.
    const orderData = {
      userId: new Types.ObjectId(userId),
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
    };

    let savedOrder!: Order;
    try {
      const createdOrder = new this.orderModel(orderData);
      savedOrder = await createdOrder.save();
    } catch (error) {
      for (const item of decrementedItems) {
        await this.productsService.updateStock(item.productId.toString(), item.quantity);
      }
      throw error;
    }

    // 5. Clear the cart
    await this.cartService.emptyCart(userId);

    return savedOrder;
  }


  async cancelOrder(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    
    if (order.status === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    // Restore stock
    for (const item of order.items) {
      await this.productsService.updateStock(item.productId.toString(), item.quantity);
    }

    order.status = 'cancelled';
    return await order.save();
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
    if (status === 'cancelled') {
      return this.cancelOrder(id);
    }

    const currentOrder = await this.orderModel.findById(id).exec();
    if (!currentOrder) {
      throw new NotFoundException('Order not found');
    }

    if (currentOrder.status === 'cancelled') {
      throw new BadRequestException('Cancelled orders cannot be reopened');
    }

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' },
    ).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
