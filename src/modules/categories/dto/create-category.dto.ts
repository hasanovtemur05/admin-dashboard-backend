import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'electronics' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiPropertyOptional({ example: 'laptop' })
    @IsString()
    @IsOptional()
    icon?: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    order?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    parentId?: number;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
