import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';

@ApiBearerAuth('JWT-auth')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get()
    findAll() {
        return this.permissionsService.findAll();
    }
}