import { IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ example: 'john' })
  @IsOptional()
  @IsString()
  search?: string;
}
