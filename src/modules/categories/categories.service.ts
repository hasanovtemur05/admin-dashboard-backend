import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class CategoriesService {
  private readonly CACHE_KEY = 'categories:tree';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly redisService: RedisService,
  ) {}

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findTree() {
    const cached = await this.redisService.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const tree = await this.categoriesRepository.findTree();
    await this.redisService.set(
      this.CACHE_KEY,
      JSON.stringify(tree),
      this.CACHE_TTL,
    );
    return tree;
  }

  async findById(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoriesRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    if (createCategoryDto.parentId) {
      const parent = await this.categoriesRepository.findById(
        createCategoryDto.parentId,
      );
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category = await this.categoriesRepository.create(createCategoryDto);
    await this.invalidateCache();
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryDto.parentId && updateCategoryDto.parentId === id) {
      throw new ConflictException('Category cannot be its own parent');
    }

    const updated = await this.categoriesRepository.update(
      id,
      updateCategoryDto,
    );
    await this.invalidateCache();
    return updated;
  }

  async softDelete(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.children && category.children.length > 0) {
      throw new ConflictException('Cannot delete category with children');
    }

    await this.categoriesRepository.softDelete(id);
    await this.invalidateCache();
    return { message: 'Category deleted successfully' };
  }

  async getProductsByCategory(
    categoryId: string,
    options?: {
      page?: number;
      limit?: number;
      sort?: string;
    },
  ) {
    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.categoriesRepository.getProductsByCategory(categoryId, options);
  }

  private async invalidateCache() {
    await this.redisService.del(this.CACHE_KEY);
  }
}
