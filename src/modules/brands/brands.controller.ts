import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all brands' })
    async findAll() {
        return this.brandsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get brand by ID' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.brandsService.findById(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get brand by slug' })
    async findBySlug(@Param('slug') slug: string) {
        return this.brandsService.findBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create brand' })
    async create(@Body() createBrandDto: CreateBrandDto) {
        return this.brandsService.create(createBrandDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update brand' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBrandDto: UpdateBrandDto,
    ) {
        return this.brandsService.update(id, updateBrandDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete brand (soft delete)' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.brandsService.softDelete(id);
    }
}
