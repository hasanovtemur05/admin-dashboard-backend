import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'brandId', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing query parameter',
  })
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: string,
    @Request() req?: any,
  ) {
    const filters: string[] = [];

    if (categoryId) filters.push(`categoryId = ${categoryId}`);
    if (brandId) filters.push(`brandId = ${brandId}`);
    if (minPrice) filters.push(`basePrice >= ${minPrice}`);
    if (maxPrice) filters.push(`basePrice <= ${maxPrice}`);

    const sortArray = sort ? [sort] : undefined;

    return this.searchService.search(query, {
      limit,
      offset,
      filters: filters.length > 0 ? filters : undefined,
      sort: sortArray,
      userId: req?.user?.id,
    });
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular searches' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Popular searches retrieved successfully',
  })
  async getPopularSearches(@Query('limit') limit?: number) {
    return this.searchService.getPopularSearches(limit);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get recent searches (requires auth)' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Recent searches retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRecentSearches(@Request() req: any, @Query('limit') limit?: number) {
    return this.searchService.getRecentSearches(req.user.id, limit);
  }
}
