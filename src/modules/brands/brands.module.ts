import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandsRepository } from './brands.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [BrandsController],
  providers: [BrandsService, BrandsRepository],
  exports: [BrandsService],
})
export class BrandsModule {}
