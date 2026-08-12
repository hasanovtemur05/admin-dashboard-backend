import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';

@Injectable()
export class PermissionsRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  findAll() {
    return [
      { id: 1, name: 'products:read', description: 'View products' },
      { id: 2, name: 'products:write', description: 'Create/edit products' },
      { id: 3, name: 'categories:read', description: 'View categories' },
      {
        id: 4,
        name: 'categories:write',
        description: 'Create/edit categories',
      },
      { id: 5, name: 'orders:read', description: 'View orders' },
      { id: 6, name: 'orders:write', description: 'Manage orders' },
      { id: 7, name: 'users:read', description: 'View users' },
      { id: 8, name: 'users:write', description: 'Manage users' },
      { id: 9, name: 'banners:read', description: 'View banners' },
      { id: 10, name: 'banners:write', description: 'Create/edit banners' },
    ];
  }
}
