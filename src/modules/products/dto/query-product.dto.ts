import { IsOptional, IsString, IsNumber, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductDto {
    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ example: 20 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional({ example: 'iphone' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    categoryId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    brandId?: number;

    @ApiPropertyOptional({ example: 100 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    minPrice?: number;

    @ApiPropertyOptional({ example: 1000 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number;

    @ApiPropertyOptional({ example: 'createdAt:desc' })
    @IsString()
    @IsOptional()
    sort?: string;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;
}
