import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductVariantDto {
    @ApiPropertyOptional({ example: 'XL' })
    @IsString()
    @IsOptional()
    size?: string;

    @ApiPropertyOptional({ example: 'Red' })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiPropertyOptional({ example: '#FF0000' })
    @IsString()
    @IsOptional()
    colorHex?: string;

    @ApiProperty({ example: 99.99 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 100 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    stockQty?: number;

    @ApiPropertyOptional({ example: 'SKU-001' })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class CreateProductImageDto {
    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiPropertyOptional({ example: 'Product image' })
    @IsString()
    @IsOptional()
    alt?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    order?: number;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    isMain?: boolean;
}

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 15 Pro' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'iphone-15-pro' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiPropertyOptional({ example: 'Latest Apple iPhone' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 'Apple flagship phone' })
    @IsString()
    @IsOptional()
    shortDesc?: string;

    @ApiPropertyOptional({ example: 'IPH-15-PRO' })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiProperty({ example: 999.99 })
    @IsNumber()
    @Min(0)
    basePrice: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    categoryId: number;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    brandId?: number;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ type: [CreateProductVariantDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    @IsOptional()
    variants?: CreateProductVariantDto[];

    @ApiPropertyOptional({ type: [CreateProductImageDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductImageDto)
    @IsOptional()
    images?: CreateProductImageDto[];
}
