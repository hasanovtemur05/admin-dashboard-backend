import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandsRepository } from './brands.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
    constructor(private readonly brandsRepository: BrandsRepository) {}

    async findAll() {
        return this.brandsRepository.findAll();
    }

    async findById(id: number) {
        const brand = await this.brandsRepository.findById(id);
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        return brand;
    }

    async findBySlug(slug: string) {
        const brand = await this.brandsRepository.findBySlug(slug);
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        return brand;
    }

    async create(createBrandDto: CreateBrandDto) {
        return this.brandsRepository.create(createBrandDto);
    }

    async update(id: number, updateBrandDto: UpdateBrandDto) {
        const brand = await this.brandsRepository.findById(id);
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        return this.brandsRepository.update(id, updateBrandDto);
    }

    async softDelete(id: number) {
        const brand = await this.brandsRepository.findById(id);
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        await this.brandsRepository.softDelete(id);
        return { message: 'Brand deleted successfully' };
    }
}
