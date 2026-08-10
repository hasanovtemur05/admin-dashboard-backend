import { IsOptional, IsPositive } from 'class-validator';

export class DashboardQueryDto {
    @IsOptional()
    @IsPositive()
    page?: number;

    @IsOptional()
    @IsPositive()
    limit?: number;
}