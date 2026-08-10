import { IsOptional, IsPositive } from 'class-validator';

export class QueryUserDto {
    @IsOptional()
    @IsPositive()
    page?: number;

    @IsOptional()
    @IsPositive()
    limit?: number;
}