import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  private readonly includeRelations = {
    category: true,
    brand: true,
    variants: { where: { isActive: true } },
    images: { orderBy: { order: 'asc' as const } },
    discounts: {
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
        AND: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
      },
    },
  };

  async findAll(query: QueryProductDto) {
    const take = query.limit || 20;
    const skip = ((query.page || 1) - 1) * take;

    const where: Prisma.ProductWhereInput = {
      isActive: query.isActive ?? true,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    if (query.minPrice || query.maxPrice) {
      where.basePrice = {};
      if (query.minPrice) where.basePrice.gte = query.minPrice;
      if (query.maxPrice) where.basePrice.lte = query.maxPrice;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (query.sort) {
      const [field, direction] = query.sort.split(':');
      orderBy[field as keyof Prisma.ProductOrderByWithRelationInput] =
        direction as 'asc' | 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      this.prismaRepository.prisma.product.findMany({
        where,
        include: this.includeRelations,
        take,
        skip,
        orderBy,
      }),
      this.prismaRepository.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: query.page || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findById(id: string) {
    return this.prismaRepository.prisma.product.findUnique({
      where: { id },
      include: this.includeRelations,
    });
  }

  async findBySlug(slug: string) {
    return this.prismaRepository.prisma.product.findUnique({
      where: { slug },
      include: this.includeRelations,
    });
  }

  async create(data: CreateProductDto) {
    const { variants, images, ...productData } = data;

    return this.prismaRepository.prisma.product.create({
      data: {
        ...productData,
        variants: variants
          ? {
              create: variants.map((v) => ({
                ...v,
                sku:
                  v.sku ||
                  `${productData.sku}-${v.size || ''}-${v.color || ''}`.replace(
                    /-$/,
                    '',
                  ),
              })),
            }
          : undefined,
        images: images ? { create: images } : undefined,
      },
      include: this.includeRelations,
    });
  }

  async update(id: string, data: UpdateProductDto) {
    const { variants, images, ...productData } = data;

    return this.prismaRepository.prisma.product.update({
      where: { id },
      data: productData,
      include: this.includeRelations,
    });
  }

  async softDelete(id: string) {
    return this.prismaRepository.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addVariant(productId: string, data: any) {
    return this.prismaRepository.prisma.productVariant.create({
      data: {
        productId,
        ...data,
      },
    });
  }

  async updateVariant(variantId: string, data: any) {
    return this.prismaRepository.prisma.productVariant.update({
      where: { id: variantId },
      data,
    });
  }

  async deleteVariant(variantId: string) {
    return this.prismaRepository.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }

  async addImage(productId: string, data: any) {
    return this.prismaRepository.prisma.productImage.create({
      data: {
        productId,
        ...data,
      },
    });
  }

  async deleteImage(imageId: string) {
    return this.prismaRepository.prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  async getWeeklyProducts(weekStart?: Date, weekEnd?: Date) {
    const now = new Date();
    const start =
      weekStart || new Date(now.setDate(now.getDate() - now.getDay()));
    const end = weekEnd || new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.prismaRepository.prisma.weeklyProduct.findMany({
      where: {
        isActive: true,
        weekStart: { lte: end },
        weekEnd: { gte: start },
      },
      include: {
        product: {
          include: {
            images: { where: { isMain: true }, take: 1 },
            variants: { where: { isActive: true }, take: 1 },
            discounts: {
              where: {
                isActive: true,
                OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
                AND: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async createWeeklyProduct(data: any) {
    return this.prismaRepository.prisma.weeklyProduct.create({
      data,
      include: { product: true },
    });
  }

  async deleteWeeklyProduct(id: string) {
    return this.prismaRepository.prisma.weeklyProduct.delete({
      where: { id },
    });
  }
}
