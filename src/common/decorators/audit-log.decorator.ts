import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'auditLog';

export interface AuditLogOptions {
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;
}

export const AuditLog = (options: AuditLogOptions) => SetMetadata(AUDIT_LOG_KEY, options);
