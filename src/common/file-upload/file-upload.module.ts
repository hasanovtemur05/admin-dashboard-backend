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
                    configService.get('s3.endpoint'),
                    configService.get('s3.port'),
                    configService.get('s3.accessKey'),
                    configService.get('s3.secretKey'),
                    configService.get('s3.bucket'),
                    configService.get('s3.useSsl'),
                );
            },
            inject: [ConfigService],
        },
    ],
    exports: [FileUploadService],
})
export class FileUploadModule {}
