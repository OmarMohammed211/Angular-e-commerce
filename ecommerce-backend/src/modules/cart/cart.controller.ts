/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, Patch, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addItem(
    @Body() addToCartDto: AddToCartDto,
    @Body('userId') userId: string,
  ) {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Patch('update-quantity')
  async updateQuantity(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(userId, productId, quantity);
  }

  @Delete('remove/:userId/:productId')
  async removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.emptyCart(userId);
  }
}