import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { SearchService as MeilisearchService } from '../../common/search/search.service';

@Injectable()
export class SearchService {
  private readonly INDEX_NAME = 'products';

  constructor(
    private readonly searchRepository: SearchRepository,
    private readonly meilisearchService: MeilisearchService,
  ) {}

  async search(
    query: string,
    options?: {
      limit?: number;
      offset?: number;
      filters?: string[];
      sort?: string[];
      userId?: string;
    },
  ) {
    const result = await this.meilisearchService.search(
      this.INDEX_NAME,
      query,
      {
        limit: options?.limit || 20,
        offset: options?.offset || 0,
        filter: options?.filters,
        sort: options?.sort,
        attributesToRetrieve: [
          'id',
          'name',
          'slug',
          'description',
          'basePrice',
          'categoryId',
          'brandId',
          'rating',
        ],
      },
    );

    // Log the search
    await this.searchRepository.logSearch(
      query,
      options?.userId,
      result.estimatedTotalHits || 0,
      options?.filters ? { filters: options.filters } : undefined,
    );

    return {
      hits: result.hits || [],
      totalHits: result.estimatedTotalHits || 0,
      query,
    };
  }

  async getPopularSearches(limit: number = 10) {
    return this.searchRepository.getPopularSearches(limit);
  }

  async getRecentSearches(userId: string, limit: number = 10) {
    return this.searchRepository.getRecentSearches(userId, limit);
  }

  async initializeIndex() {
    await this.meilisearchService.createIndex(this.INDEX_NAME, 'id');

    await this.meilisearchService.configureIndex(this.INDEX_NAME, {
      searchableAttributes: ['name', 'description', 'slug'],
      filterableAttributes: ['categoryId', 'brandId', 'basePrice', 'rating'],
      sortableAttributes: ['basePrice', 'rating', 'createdAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
      ],
    });
  }
}
