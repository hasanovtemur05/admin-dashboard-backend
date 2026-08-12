import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { RedisService } from '../../common/redis/redis.service';
import { SearchService } from '../../common/search/search.service';

@Injectable()
export class ProductsService {
    private readonly INDEX_NAME = 'products';

    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly redisService: RedisService,
        private readonly searchService: SearchService,
    ) {}

    async findAll(query: QueryProductDto) {
        return this.productsRepository.findAll(query);
    }

    async findById(id: number) {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async findBySlug(slug: string) {
        const product = await this.productsRepository.findBySlug(slug);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async create(createProductDto: CreateProductDto) {
        const product = await this.productsRepository.create(createProductDto);

        // Index in Meilisearch
        await this.searchService.addDocuments(this.INDEX_NAME, [
            {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                basePrice: Number(product.basePrice),
                categoryId: product.categoryId,
                brandId: product.brandId,
                rating: Number(product.rating),
            },
        ]);

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const updated = await this.productsRepository.update(id, updateProductDto);

        // Update in Meilisearch
        await this.searchService.updateDocuments(this.INDEX_NAME, [
            {
                id: updated.id,
                name: updated.name,
                slug: updated.slug,
                description: updated.description,
                basePrice: Number(updated.basePrice),
                categoryId: updated.categoryId,
                brandId: updated.brandId,
                rating: Number(updated.rating),
            },
        ]);

        return updated;
    }

    async softDelete(id: number) {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.productsRepository.softDelete(id);

        // Remove from Meilisearch
        await this.searchService.deleteDocument(this.INDEX_NAME, id);

        return { message: 'Product deleted successfully' };
    }

    async addVariant(productId: number, data: any) {
        const product = await this.productsRepository.findById(productId);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.productsRepository.addVariant(productId, data);
    }

    async updateVariant(variantId: number, data: any) {
        return this.productsRepository.updateVariant(variantId, data);
    }

    async deleteVariant(variantId: number) {
        return this.productsRepository.deleteVariant(variantId);
    }

    async addImage(productId: number, data: any) {
        const product = await this.productsRepository.findById(productId);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.productsRepository.addImage(productId, data);
    }

    async deleteImage(imageId: number) {
        return this.productsRepository.deleteImage(imageId);
    }

    async getWeeklyProducts(weekStart?: Date, weekEnd?: Date) {
        const cacheKey = `weekly-products:${weekStart?.toISOString()}:${weekEnd?.toISOString()}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const products = await this.productsRepository.getWeeklyProducts(weekStart, weekEnd);
        await this.redisService.set(cacheKey, JSON.stringify(products), 3600);
        return products;
    }

    async createWeeklyProduct(data: any) {
        const product = await this.productsRepository.createWeeklyProduct(data);
        await this.redisService.delPattern('weekly-products:*');
        return product;
    }

    async deleteWeeklyProduct(id: number) {
        await this.productsRepository.deleteWeeklyProduct(id);
        await this.redisService.delPattern('weekly-products:*');
        return { message: 'Weekly product removed successfully' };
    }
}
