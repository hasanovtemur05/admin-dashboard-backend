import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    endpoint: string,
    port: number,
    accessKey: string,
    secretKey: string,
    bucket: string,
    useSsl: boolean,
  ) {
    this.bucket = bucket;
    this.s3Client = new S3Client({
      endpoint: `${useSsl ? 'https' : 'http'}://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    const ext = path.extname(file.originalname);
    const key = `${folder}/${randomUUID()}${ext}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `/${this.bucket}/${key}`;
    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to delete file: ${key}`, error);
    }
  }

  getPublicUrl(key: string): string {
    return `/${this.bucket}/${key}`;
  }
}
