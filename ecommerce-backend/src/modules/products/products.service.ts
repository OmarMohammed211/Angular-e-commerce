/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/products.schemas';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true, runValidators: true },
    ).exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string; }> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }

    return { message: 'Product deleted successfully' };
  }
  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.productModel.find({ categoryId })
      .select('name price image stock description categoryId') // Explicit projection
      .lean()
      .exec();
  }

  async findMany(ids: string[]): Promise<Product[]> {
    return await this.productModel.find({ _id: { $in: ids } })
      .lean()
      .exec();
  }

  async search(query: string): Promise<Product[]> {
    const regex = new RegExp(query, 'i');
    return await this.productModel.find(
      {
        $or: [
          { name: regex },
          { description: regex },
        ],
      },
    ).select('name price image stock description')
    .lean()
    .exec();
  }

  async updateStock(productId: string, quantityChange: number): Promise<void> {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    
    product.stock += quantityChange;
    if (product.stock < 0) product.stock = 0; // Prevent negative stock
    
    await product.save();
  }

  async findRelated(productId: string): Promise<Product[]> {
    const product = await this.findOne(productId);
    return await this.productModel.find({
      categoryId: product.categoryId,
      _id: { $ne: productId }
    }).limit(4).lean().exec();
  }
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find()
      .select('name price image stock description')
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).lean().exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
