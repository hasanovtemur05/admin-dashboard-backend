import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByPhone(phone: string) {
    return this.usersRepository.findByPhone(phone);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async findAll(query: QueryUserDto) {
    return this.usersRepository.findAll(query);
  }

  async create(data: CreateUserDto) {
    return this.usersRepository.create(data);
  }

  async updatePassword(id: string, password: string) {
    return this.usersRepository.updatePassword(id, password);
  }

  async update(id: string, data: Partial<CreateUserDto>) {
    return this.usersRepository.update(id, data);
  }

  async softDelete(id: string) {
    return this.usersRepository.softDelete(id);
  }
}
