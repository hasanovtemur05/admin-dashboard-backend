import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
    @ApiProperty({ example: 'Summer Sale' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'Up to 50% off' })
    @IsString()
    @IsOptional()
    subtitle?: string;

    @ApiProperty({ example: 'https://example.com/banner.jpg' })
    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @ApiPropertyOptional({ example: '/products/summer-sale' })
    @IsString()
    @IsOptional()
    link?: string;

    @ApiPropertyOptional({ example: 'top', enum: ['top', 'middle', 'bottom'] })
    @IsString()
    @IsIn(['top', 'middle', 'bottom'])
    @IsOptional()
    position?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    order?: number;

    @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
    @IsDateString()
    @IsOptional()
    startsAt?: string;

    @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
    @IsDateString()
    @IsOptional()
    endsAt?: string;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
