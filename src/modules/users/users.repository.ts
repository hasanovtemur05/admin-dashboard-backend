import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
    constructor(private readonly prismaRepository: PrismaRepository) { }

    findByUsername(username: string) {
        return this.prismaRepository.prisma.user.findUnique({ where: { username }, include: { role: true } });
    }

    findById(id: number) {
        return this.prismaRepository.prisma.user.findUnique({ where: { id } });
    }

    findAll(query: { page?: number; limit?: number }) {
        const take = Number(query.limit ?? 20);
        const skip = (Number(query.page ?? 1) - 1) * take;
        return this.prismaRepository.prisma.user.findMany({ take, skip });
    }

    create(data: CreateUserDto) {
        return this.prismaRepository.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        });
    }

    updatePassword(id: number, password: string) {
        return this.prismaRepository.prisma.user.update({
            where: { id },
            data: { password },
        });
    }
}