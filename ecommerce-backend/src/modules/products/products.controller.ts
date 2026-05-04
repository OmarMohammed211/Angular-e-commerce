/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/products.schemas';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }
  // Add these new endpoints
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.remove(id);
  }

  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return this.productsService.findByCategory(categoryId);
  }

  @Get('search')
  search(@Query('q') query: string): Promise<Product[]> {
    return this.productsService.search(query);
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string): Promise<Product[]> {
    return this.productsService.findRelated(id);
  }
}