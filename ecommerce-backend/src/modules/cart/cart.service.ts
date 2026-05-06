/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    // 1. Verify product exists and check stock
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productIdObj = new Types.ObjectId(productId);
    const userIdObj = new Types.ObjectId(userId);

    // Get current cart to check existing quantity
    const cart = await this.cartModel.findOne({ userId: userIdObj });
    let currentQuantity = 0;
    if (cart) {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        currentQuantity = existingItem.quantity;
      }
    }

    if (currentQuantity + quantity > product.stock) {
      throw new BadRequestException(`Cannot add to cart. Only ${product.stock} items available in stock.`);
    }

    // atomic update: try to increment quantity if item exists
    const result = await this.cartModel.findOneAndUpdate(
      { userId: userIdObj, 'items.productId': productIdObj },
      { $inc: { 'items.$.quantity': quantity } },
      { returnDocument: 'after' }
    ).exec();

    if (!result) {
      // If item doesn't exist, push it or create cart
      await this.cartModel.findOneAndUpdate(
        { userId: userIdObj },
        { $push: { items: { productId: productIdObj, quantity } } },
        { upsert: true, returnDocument: 'after' }
      ).exec();
    }

    return this.getCart(userId);
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('items.productId', 'name price image description stock')
      .lean()
      .exec();

    if (!cart) {
      return { userId: new Types.ObjectId(userId), items: [] };
    }
    return cart;
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    await this.cartModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $pull: { items: { productId: new Types.ObjectId(productId) } } }
    ).exec();

    return this.getCart(userId); // Return populated cart
  }

  async emptyCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: { items: [] } },
      { returnDocument: 'after' }
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
  const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });

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

  // Check stock
  const product = await this.productsService.findOne(productId);
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  if (newQuantity > product.stock) {
    throw new BadRequestException(`Cannot update quantity. Only ${product.stock} items available in stock.`);
  }

  // Update the quantity
  cart.items[itemIndex].quantity = newQuantity;

  await cart.save();
  return this.getCart(userId);
}

}