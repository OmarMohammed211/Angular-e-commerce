/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addItem(
    @Body() addToCartDto: AddToCartDto,
    @Body('userId') userId: string, // Ideally comes from AuthGuard
  ) {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete('remove/:userId/:productId')
  async removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(userId, productId);
  }
}