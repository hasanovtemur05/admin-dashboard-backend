import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';

@Injectable()
export class SearchRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async logSearch(
    query: string,
    userId?: number,
    resultsCount?: number,
    filters?: any,
  ) {
    return this.prismaRepository.prisma.searchLog.create({
      data: {
        query,
        userId,
        resultsCount: resultsCount || 0,
        filters,
      },
    });
  }

  async getPopularSearches(limit: number = 10) {
    const results = await this.prismaRepository.prisma.searchLog.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return results.map((r) => ({
      query: r.query,
      count: r._count.query,
    }));
  }

  async getRecentSearches(userId: number, limit: number = 10) {
    return this.prismaRepository.prisma.searchLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      distinct: ['query'],
    });
  }
}
