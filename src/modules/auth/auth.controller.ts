import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login', description: 'Authenticate user and return JWT tokens' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Successfully logged in',
        schema: {
            example: {
                status: 'success',
                data: {
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user', description: 'Create a new user account and return JWT tokens' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
    })
    @ApiResponse({
        status: 409,
        description: 'Phone number or email already exists',
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token', description: 'Get new access & refresh tokens using a valid refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Tokens refreshed successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid or expired refresh token',
    })
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Change password', description: 'Change password for the currently logged-in user (requires JWT)' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Current password is incorrect or user not authenticated',
    })
    async changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(req.user.id, changePasswordDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current user profile', description: 'Return profile of the currently logged-in user (requires JWT)' })
    @ApiResponse({
        status: 200,
        description: 'Profile retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token missing or invalid',
    })
    async getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.id);
    }
}
