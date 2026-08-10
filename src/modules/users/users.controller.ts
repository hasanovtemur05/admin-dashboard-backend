import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { QueryUserDto } from './dto/query-user.dto';

@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(@Query() query: QueryUserDto) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(Number(id));
    }
}