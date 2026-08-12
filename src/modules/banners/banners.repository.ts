import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async findAll() {
    return this.prismaRepository.prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findActive(position?: string) {
    const now = new Date();
    return this.prismaRepository.prisma.banner.findMany({
      where: {
        isActive: true,
        ...(position && { position }),
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ endsAt: null }, { endsAt: { gte: now } }],
      },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prismaRepository.prisma.banner.findUnique({
      where: { id },
    });
  }

  async create(data: CreateBannerDto) {
    return this.prismaRepository.prisma.banner.create({
      data,
    });
  }

  async update(id: number, data: UpdateBannerDto) {
    return this.prismaRepository.prisma.banner.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prismaRepository.prisma.banner.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async delete(id: number) {
    return this.prismaRepository.prisma.banner.delete({
      where: { id },
    });
  }
}
