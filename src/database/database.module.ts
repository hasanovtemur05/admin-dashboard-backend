import { Module } from '@nestjs/common';
import { PrismaRepository } from './prisma.repository';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, PrismaRepository],
  exports: [PrismaService, PrismaRepository],
})
export class DatabaseModule {}
