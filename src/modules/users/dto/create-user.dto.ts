import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({ example: '+998901234567', description: 'Unique phone number' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiPropertyOptional({ example: 'johndoe@example.com', description: 'User email address' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ enum: UserRole, default: UserRole.MODERATOR })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}