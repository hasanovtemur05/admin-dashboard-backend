import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}

    findAll() {
        return this.rolesRepository.findAll();
    }

    findOne(id: number) {
        return this.rolesRepository.findOne(id);
    }

    create(payload: CreateRoleDto) {
        return this.rolesRepository.create(payload);
    }
}