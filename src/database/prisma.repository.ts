import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaRepository {
  constructor(public readonly prisma: PrismaService) {}
}
