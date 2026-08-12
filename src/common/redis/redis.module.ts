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
          configService.get<string>('redis.host') || 'localhost',
          configService.get<number>('redis.port') || 6379,
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
