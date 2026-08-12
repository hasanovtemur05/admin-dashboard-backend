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
                    configService.get('meilisearch.host'),
                    configService.get('meilisearch.apiKey'),
                );
            },
            inject: [ConfigService],
        },
    ],
    exports: [SearchService],
})
export class SearchModule {}
