import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { Prisma, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersRepository {
    constructor(private readonly prismaRepository: PrismaRepository) {}

    async findAll(query: { page?: number; limit?: number; status?: OrderStatus; userId?: number }) {
        const take = query.limit || 20;
        const skip = ((query.page || 1) - 1) * take;

        const where: Prisma.OrderWhereInput = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.userId) {
            where.userId = query.userId;
        }

        const [orders, total] = await Promise.all([
            this.prismaRepository.prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            phone: true,
                            email: true,
                            name: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                            productVariant: {
                                select: {
                                    id: true,
                                    size: true,
                                    color: true,
                                },
                            },
                        },
                    },
                },
                take,
                skip,
                orderBy: { createdAt: 'desc' },
            }),
            this.prismaRepository.prisma.order.count({ where }),
        ]);

        return {
            data: orders,
            meta: {
                total,
                page: query.page || 1,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    async findById(id: number) {
        return this.prismaRepository.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        name: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                        productVariant: true,
                    },
                },
            },
        });
    }

    async create(data: { userId: number; items: any[]; notes?: string }) {
        const { userId, items, notes } = data;

        // Calculate total price
        let totalPrice = new Prisma.Decimal(0);

        const orderItems = await Promise.all(
            items.map(async (item) => {
                const variant = await this.prismaRepository.prisma.productVariant.findUnique({
                    where: { id: item.productVariantId },
                    include: { product: true },
                });

                if (!variant) {
                    throw new Error(`Variant ${item.productVariantId} not found`);
                }

                if (variant.stockQty < item.qty) {
                    throw new Error(`Insufficient stock for variant ${item.productVariantId}`);
                }

                const itemTotal = variant.price.mul(item.qty);
                totalPrice = totalPrice.add(itemTotal);

                return {
                    productVariantId: variant.id,
                    productId: variant.product.id,
                    qty: item.qty,
                    price: variant.price,
                };
            }),
        );

        const order = await this.prismaRepository.prisma.order.create({
            data: {
                userId,
                totalPrice,
                notes,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
            },
        });

        // Update stock
        await Promise.all(
            items.map((item) =>
                this.prismaRepository.prisma.productVariant.update({
                    where: { id: item.productVariantId },
                    data: {
                        stockQty: {
                            decrement: item.qty,
                        },
                    },
                }),
            ),
        );

        return order;
    }

    async updateStatus(id: number, status: OrderStatus) {
        return this.prismaRepository.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: true,
            },
        });
    }

    async getStats() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalOrders, todayOrders, monthOrders, totalRevenue, monthRevenue] =
            await Promise.all([
                this.prismaRepository.prisma.order.count(),
                this.prismaRepository.prisma.order.count({
                    where: { createdAt: { gte: startOfDay } },
                }),
                this.prismaRepository.prisma.order.count({
                    where: { createdAt: { gte: startOfMonth } },
                }),
                this.prismaRepository.prisma.order.aggregate({
                    _sum: { totalPrice: true },
                }),
                this.prismaRepository.prisma.order.aggregate({
                    _sum: { totalPrice: true },
                    where: { createdAt: { gte: startOfMonth } },
                }),
            ]);

        return {
            totalOrders,
            todayOrders,
            monthOrders,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            monthRevenue: monthRevenue._sum.totalPrice || 0,
        };
    }
}
