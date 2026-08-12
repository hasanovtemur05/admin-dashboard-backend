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
  @ApiQuery({
    name: 'position',
    required: false,
    enum: ['top', 'middle', 'bottom'],
  })
  @ApiResponse({
    status: 200,
    description: 'Active banners retrieved successfully',
  })
  async findActive(@Query('position') position?: string) {
    return this.bannersService.findActive(position);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all banners (admin)' })
  @ApiResponse({
    status: 200,
    description: 'All banners retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async findAll() {
    return this.bannersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiResponse({ status: 200, description: 'Banner retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create banner' })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(createBannerDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update banner' })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannersService.update(id, updateBannerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete banner (soft delete)' })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.softDelete(id);
  }
}
