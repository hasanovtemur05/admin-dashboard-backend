import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'johndoe', description: 'Unique username' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}