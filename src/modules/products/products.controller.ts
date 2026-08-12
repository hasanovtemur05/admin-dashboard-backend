import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'brandId', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly products' })
  @ApiQuery({ name: 'weekStart', required: false })
  @ApiQuery({ name: 'weekEnd', required: false })
  @ApiResponse({
    status: 200,
    description: 'Weekly products retrieved successfully',
  })
  async getWeeklyProducts(
    @Query('weekStart') weekStart?: string,
    @Query('weekEnd') weekEnd?: string,
  ) {
    return this.productsService.getWeeklyProducts(
      weekStart ? new Date(weekStart) : undefined,
      weekEnd ? new Date(weekEnd) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete product (soft delete)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.softDelete(id);
  }

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add product variant' })
  @ApiResponse({ status: 201, description: 'Variant added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addVariant(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.productsService.addVariant(id, data);
  }

  @Put('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product variant' })
  @ApiResponse({ status: 200, description: 'Variant updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async updateVariant(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() data: any,
  ) {
    return this.productsService.updateVariant(variantId, data);
  }

  @Delete('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete product variant' })
  @ApiResponse({ status: 200, description: 'Variant deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async removeVariant(@Param('variantId', ParseIntPipe) variantId: number) {
    return this.productsService.deleteVariant(variantId);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add product image' })
  @ApiResponse({ status: 201, description: 'Image added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addImage(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.productsService.addImage(id, data);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete product image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.productsService.deleteImage(imageId);
  }

  @Post('weekly')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add product to weekly products' })
  @ApiResponse({ status: 201, description: 'Product added to weekly list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createWeeklyProduct(@Body() data: any) {
    return this.productsService.createWeeklyProduct(data);
  }

  @Delete('weekly/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove from weekly products' })
  @ApiResponse({ status: 200, description: 'Product removed from weekly list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Weekly product not found' })
  async removeWeeklyProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteWeeklyProduct(id);
  }
}
