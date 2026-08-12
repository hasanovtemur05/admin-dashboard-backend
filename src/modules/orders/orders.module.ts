import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
