import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';

@Injectable()
export class PermissionsRepository {
    constructor(private readonly prismaRepository: PrismaRepository) {}

    findAll() {
        return this.prismaRepository.prisma.permission.findMany();
    }
}