import { Controller, Get, Param, Query, UseGuards, Put, Body, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findAll(@Query() query: QueryUserDto) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user by ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update user' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
    ) {
        return this.usersService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete user (soft delete)' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.softDelete(id);
    }
}
