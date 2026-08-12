import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandsRepository } from './brands.repository';

@Module({
    controllers: [BrandsController],
    providers: [BrandsService, BrandsRepository],
    exports: [BrandsService],
})
export class BrandsModule {}
