import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';

@Global()
@Module({
  providers: [
    {
      provide: FileUploadService,
      useFactory: (configService: ConfigService) => {
        return new FileUploadService(
          configService.get<string>('s3.endpoint') || 'localhost',
          configService.get<number>('s3.port') || 9000,
          configService.get<string>('s3.accessKey') || '',
          configService.get<string>('s3.secretKey') || '',
          configService.get<string>('s3.bucket') || 'market-bucket',
          configService.get<boolean>('s3.useSsl') || false,
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [FileUploadService],
})
export class FileUploadModule {}
