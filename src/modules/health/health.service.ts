import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaRepository: PrismaRepository,
    private readonly redisService: RedisService,
  ) {}

  async check() {
    const checks: Record<string, string> = {};

    // Database check
    try {
      await this.prismaRepository.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch {
      checks.database = 'error';
    }

    // Redis check
    try {
      await this.redisService.set('health:check', 'ok', 10);
      const value = await this.redisService.get('health:check');
      checks.redis = value === 'ok' ? 'ok' : 'error';
    } catch {
      checks.redis = 'error';
    }

    const status = Object.values(checks).every((v) => v === 'ok')
      ? 'ok'
      : 'degraded';

    return {
      status,
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
