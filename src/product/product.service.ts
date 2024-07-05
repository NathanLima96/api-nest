import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        userId,
      },
    });
  }

  async productsUser(userId: number) {
    return this.prisma.product.findMany({ where: { userId: userId } });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id: id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Product name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const product = await this.prisma.product.findFirst({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
