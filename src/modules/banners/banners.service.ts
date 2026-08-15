import { Injectable, NotFoundException } from '@nestjs/common';
import { BannersRepository } from './banners.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class BannersService {
  private readonly CACHE_KEY = 'banners:active';

  constructor(
    private readonly bannersRepository: BannersRepository,
    private readonly redisService: RedisService,
  ) {}

  async findAll() {
    return this.bannersRepository.findAll();
  }

  async findActive(position?: string) {
    const cacheKey = position
      ? `${this.CACHE_KEY}:${position}`
      : this.CACHE_KEY;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const banners = await this.bannersRepository.findActive(position);
    await this.redisService.set(cacheKey, JSON.stringify(banners), 300); // 5 minutes
    return banners;
  }

  async findById(id: string) {
    const banner = await this.bannersRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return banner;
  }

  async create(createBannerDto: CreateBannerDto) {
    const banner = await this.bannersRepository.create(createBannerDto);
    await this.invalidateCache();
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannersRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    const updated = await this.bannersRepository.update(id, updateBannerDto);
    await this.invalidateCache();
    return updated;
  }

  async softDelete(id: string) {
    const banner = await this.bannersRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    await this.bannersRepository.softDelete(id);
    await this.invalidateCache();
    return { message: 'Banner deleted successfully' };
  }

  async delete(id: string) {
    const banner = await this.bannersRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    await this.bannersRepository.delete(id);
    await this.invalidateCache();
    return { message: 'Banner permanently deleted' };
  }

  private async invalidateCache() {
    await this.redisService.delPattern('banners:*');
  }
}
