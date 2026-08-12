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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Get category tree' })
    @ApiResponse({ status: 200, description: 'Return category tree' })
    async findTree() {
        return this.categoriesService.findTree();
    }

    @Get('flat')
    @ApiOperation({ summary: 'Get all categories flat list' })
    async findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findById(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get category by slug' })
    async findBySlug(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }

    @Get(':id/products')
    @ApiOperation({ summary: 'Get products by category' })
    async getProductsByCategory(
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('sort') sort?: string,
    ) {
        return this.categoriesService.getProductsByCategory(id, { page, limit, sort });
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create category' })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update category' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete category (soft delete)' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.softDelete(id);
    }
}
