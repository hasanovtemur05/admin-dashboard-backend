import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { BannersRepository } from './banners.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [BannersController],
  providers: [BannersService, BannersRepository],
  exports: [BannersService],
})
export class BannersModule {}
