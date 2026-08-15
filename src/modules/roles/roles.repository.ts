import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';

@Injectable()
export class RolesRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  findAll() {
    return [
      { id: 1, name: 'ADMIN', description: 'Full access to all endpoints' },
      { id: 2, name: 'USER', description: 'Regular user access' },
    ];
  }

  findOne(id: number) {
    const roles = this.findAll();
    return roles.find((r) => r.id === id);
  }
}
