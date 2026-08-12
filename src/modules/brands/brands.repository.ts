import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsRepository {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async findAll() {
    return this.prismaRepository.prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prismaRepository.prisma.brand.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return this.prismaRepository.prisma.brand.findUnique({
      where: { slug },
    });
  }

  async create(data: CreateBrandDto) {
    return this.prismaRepository.prisma.brand.create({
      data,
    });
  }

  async update(id: number, data: UpdateBrandDto) {
    return this.prismaRepository.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prismaRepository.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
