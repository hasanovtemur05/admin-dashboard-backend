import { IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsPositive()
  limit?: number;
}
