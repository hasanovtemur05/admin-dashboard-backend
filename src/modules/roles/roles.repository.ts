import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesRepository {
    constructor(private readonly prismaRepository: PrismaRepository) {}

    findAll() {
        return this.prismaRepository.prisma.role.findMany({ include: { permissions: true } });
    }

    findOne(id: number) {
        return this.prismaRepository.prisma.role.findUnique({ where: { id }, include: { permissions: true } });
    }

    create(payload: CreateRoleDto) {
        return this.prismaRepository.prisma.role.create({
            data: {
                name: payload.name,
            },
        });
    }
}