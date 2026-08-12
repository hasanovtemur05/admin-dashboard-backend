import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all orders' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
    @ApiQuery({ name: 'userId', required: false })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('status') status?: OrderStatus,
        @Query('userId') userId?: number,
    ) {
        return this.ordersService.findAll({ page, limit, status, userId });
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get order statistics' })
    async getStats() {
        return this.ordersService.getStats();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get order by ID' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create order' })
    async create(
        @Body() data: { items: any[]; notes?: string },
        @Query('userId') userId: number,
    ) {
        return this.ordersService.create({ userId, ...data });
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update order status' })
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: OrderStatus,
    ) {
        return this.ordersService.updateStatus(id, status);
    }
}
