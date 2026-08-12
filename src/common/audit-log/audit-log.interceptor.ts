import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from './audit-log.service';
import { AUDIT_LOG_KEY, AuditLogOptions } from '../decorators/audit-log.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly auditLogService: AuditLogService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditLogOptions = this.reflector.get<AuditLogOptions>(
            AUDIT_LOG_KEY,
            context.getHandler(),
        );

        if (!auditLogOptions) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(async (response) => {
                try {
                    await this.auditLogService.log({
                        adminId: user.id,
                        action: auditLogOptions.action,
                        entity: auditLogOptions.entity,
                        entityId: response?.id || response?.data?.id,
                        details: {
                            method: request.method,
                            url: request.url,
                            body: this.sanitizeBody(request.body),
                        },
                        ipAddress: request.ip,
                    });
                } catch (error) {
                    // Ignore audit log errors
                }
            }),
        );
    }

    private sanitizeBody(body: any): any {
        if (!body) return body;

        const sanitized = { ...body };
        const sensitiveFields = ['password', 'passwordHash', 'token', 'secret'];

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '***';
            }
        }

        return sanitized;
    }
}
