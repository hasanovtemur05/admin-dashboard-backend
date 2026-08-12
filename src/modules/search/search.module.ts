import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
  exports: [SearchService],
})
export class SearchModule {}
