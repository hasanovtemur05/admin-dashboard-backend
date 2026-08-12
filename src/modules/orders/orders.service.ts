import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository) {}

    async findAll(query: { page?: number; limit?: number; status?: OrderStatus; userId?: number }) {
        return this.ordersRepository.findAll(query);
    }

    async findById(id: number) {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async create(data: { userId: number; items: any[]; notes?: string }) {
        return this.ordersRepository.create(data);
    }

    async updateStatus(id: number, status: OrderStatus) {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.ordersRepository.updateStatus(id, status);
    }

    async getStats() {
        return this.ordersRepository.getStats();
    }
}
