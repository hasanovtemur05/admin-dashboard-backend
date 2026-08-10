import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({ example: 'admin123', description: 'Current password' })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({ example: 'newPassword123!', description: 'New password (min 6 chars)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}