import { Injectable } from '@nestjs/common';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
    getSummary(query: DashboardQueryDto) {
        return {
            totalUsers: 12,
            activeSessions: 5,
            metrics: {
                page: query.page ?? 1,
                limit: query.limit ?? 10,
            },
        };
    }
}