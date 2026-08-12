import { Injectable, Logger } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prismaRepository: PrismaRepository) {}

  async log(data: {
    adminId: number;
    action: string;
    entity: string;
    entityId?: number;
    details?: any;
    ipAddress?: string;
  }) {
    try {
      await this.prismaRepository.prisma.adminAuditLog.create({
        data,
      });
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    adminId?: number;
    entity?: string;
  }) {
    const take = query.limit || 20;
    const skip = ((query.page || 1) - 1) * take;

    const where: any = {};

    if (query.adminId) {
      where.adminId = query.adminId;
    }

    if (query.entity) {
      where.entity = query.entity;
    }

    const [logs, total] = await Promise.all([
      this.prismaRepository.prisma.adminAuditLog.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              phone: true,
              name: true,
            },
          },
        },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaRepository.prisma.adminAuditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page: query.page || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}
