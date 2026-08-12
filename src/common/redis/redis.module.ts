import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
    providers: [
        {
            provide: RedisService,
            useFactory: (configService: ConfigService) => {
                return new RedisService(
                    configService.get('redis.host'),
                    configService.get('redis.port'),
                );
            },
            inject: [ConfigService],
        },
    ],
    exports: [RedisService],
})
export class RedisModule {}
