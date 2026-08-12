import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';

@Injectable()
export class RolesRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  findAll() {
    return [
      { id: 1, name: 'SUPER_ADMIN', description: 'Full access' },
      { id: 2, name: 'CONTENT_MANAGER', description: 'Manage content' },
      { id: 3, name: 'MODERATOR', description: 'Limited access' },
    ];
  }

  findOne(id: number) {
    const roles = this.findAll();
    return roles.find((r) => r.id === id);
  }
}
