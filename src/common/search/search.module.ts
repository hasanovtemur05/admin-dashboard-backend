import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';

@Global()
@Module({
  providers: [
    {
      provide: SearchService,
      useFactory: (configService: ConfigService) => {
        return new SearchService(
          configService.get<string>('meilisearch.host') ||
            'http://localhost:7700',
          configService.get<string>('meilisearch.apiKey') || '',
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}
