/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    // 1. Verify product exists
    await this.productsService.findOne(productId);

    // 2. Find user's cart
    let cart = await this.cartModel.findOne({ userId });

    // Convert string IDs to ObjectId
    const productIdObj = new Types.ObjectId(productId);
    const userIdObj = new Types.ObjectId(userId);

    if (!cart) {
      cart = await this.cartModel.create({
        userId: userIdObj,
        items: [{ productId: productIdObj, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Push new item with ObjectId
        cart.items.push({ productId: productIdObj, quantity });
      }

      await cart.save();
    }

    return cart;
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({ userId })
      .populate('items.productId', 'name price image')
      .lean()
      .exec();

    if (!cart) {
      return { userId: new Types.ObjectId(userId), items: [] };
    }
    return cart;
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();
    return this.getCart(userId); // Return populated cart
  }

  async emptyCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!cart) {
      // If no cart exists, return an empty one
      return { userId: new Types.ObjectId(userId), items: [] };
    }
    
    return cart;
  }

  async updateItemQuantity(
  userId: string,
  productId: string,
  newQuantity: number,
): Promise<Cart> {
  const cart = await this.cartModel.findOne({ userId });

  if (!cart) throw new NotFoundException('Cart not found');

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    throw new NotFoundException('Item not found in cart');
  }

  if (newQuantity <= 0) {
    // If quantity is zero or less, remove the item
    return this.removeItem(userId, productId);
  }

  // Update the quantity
  cart.items[itemIndex].quantity = newQuantity;

  await cart.save();
  return this.getCart(userId);
}

}