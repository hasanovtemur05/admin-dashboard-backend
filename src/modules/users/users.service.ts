import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async findByUsername(username: string) {
        return this.usersRepository.findByUsername(username);
    }

    async findById(id: number) {
        return this.usersRepository.findById(id);
    }

    async findAll(query: QueryUserDto) {
        return this.usersRepository.findAll(query);
    }

    async create(data: CreateUserDto) {
        return this.usersRepository.create(data);
    }
}