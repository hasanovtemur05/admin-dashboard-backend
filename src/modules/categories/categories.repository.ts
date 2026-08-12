import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async findAll() {
    return this.prismaRepository.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findTree() {
    const categories = await this.prismaRepository.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    return categories.filter((c) => !c.parentId);
  }

  async findById(id: number) {
    return this.prismaRepository.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prismaRepository.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async create(data: CreateCategoryDto) {
    return this.prismaRepository.prisma.category.create({
      data,
    });
  }

  async update(id: number, data: UpdateCategoryDto) {
    return this.prismaRepository.prisma.category.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prismaRepository.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getProductsByCategory(
    categoryId: number,
    options?: {
      page?: number;
      limit?: number;
      sort?: string;
    },
  ) {
    const take = options?.limit || 20;
    const skip = ((options?.page || 1) - 1) * take;

    const [products, total] = await Promise.all([
      this.prismaRepository.prisma.product.findMany({
        where: {
          categoryId,
          isActive: true,
        },
        include: {
          images: {
            where: { isMain: true },
            take: 1,
          },
          variants: {
            where: { isActive: true },
            take: 1,
          },
          brand: true,
          discounts: {
            where: {
              isActive: true,
              OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
              AND: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
            },
          },
        },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaRepository.prisma.product.count({
        where: {
          categoryId,
          isActive: true,
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: options?.page || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}
