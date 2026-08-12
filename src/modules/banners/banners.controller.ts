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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) {}

    @Get()
    @ApiOperation({ summary: 'Get active banners' })
    @ApiQuery({ name: 'position', required: false, enum: ['top', 'middle', 'bottom'] })
    async findActive(@Query('position') position?: string) {
        return this.bannersService.findActive(position);
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all banners (admin)' })
    async findAll() {
        return this.bannersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get banner by ID' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.bannersService.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create banner' })
    async create(@Body() createBannerDto: CreateBannerDto) {
        return this.bannersService.create(createBannerDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update banner' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBannerDto: UpdateBannerDto,
    ) {
        return this.bannersService.update(id, updateBannerDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete banner (soft delete)' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.bannersService.softDelete(id);
    }
}
