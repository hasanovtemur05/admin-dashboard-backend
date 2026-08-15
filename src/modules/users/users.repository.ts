import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  findByPhone(phone: string) {
    return this.prismaRepository.prisma.user.findUnique({
      where: { phone },
    });
  }

  findByEmail(email: string) {
    return this.prismaRepository.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prismaRepository.prisma.user.findUnique({ where: { id } });
  }

  findAll(query: { page?: number; limit?: number; search?: string }) {
    const take = Number(query.limit ?? 20);
    const skip = (Number(query.page ?? 1) - 1) * take;

    const where: any = {};
    if (query.search) {
      where.OR = [
        { phone: { contains: query.search } },
        { email: { contains: query.search } },
        { name: { contains: query.search } },
      ];
    }

    return this.prismaRepository.prisma.user.findMany({
      where,
      take,
      skip,
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: CreateUserDto) {
    return this.prismaRepository.prisma.user.create({
      data: {
        phone: data.phone,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      },
    });
  }

  updatePassword(id: string, password: string) {
    return this.prismaRepository.prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  update(id: string, data: Partial<CreateUserDto>) {
    return this.prismaRepository.prisma.user.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string) {
    return this.prismaRepository.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
