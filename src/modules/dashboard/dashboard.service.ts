import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async getSummary(query: DashboardQueryDto) {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [
      totalUsers,
      todayUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      todayOrders,
      monthOrders,
      totalRevenue,
      monthRevenue,
    ] = await Promise.all([
      this.prismaRepository.prisma.user.count(),
      this.prismaRepository.prisma.user.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      this.prismaRepository.prisma.product.count(),
      this.prismaRepository.prisma.product.count({
        where: { isActive: true },
      }),
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
      users: {
        total: totalUsers,
        today: todayUsers,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        month: monthOrders,
      },
      revenue: {
        total: totalRevenue._sum.totalPrice || 0,
        month: monthRevenue._sum.totalPrice || 0,
      },
    };
  }
}
