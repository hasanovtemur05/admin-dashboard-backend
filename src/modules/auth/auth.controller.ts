import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // ==========================================
    // POST /api/auth/login
    // ==========================================
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
        schema: {
            example: {
                status: 'error',
                statusCode: 401,
                message: { message: 'Invalid credentials', error: 'Unauthorized', statusCode: 401 },
                path: '/api/auth/login',
            },
        },
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // ==========================================
    // POST /api/auth/register
    // ==========================================
    @Post('register')
    @ApiOperation({ summary: 'Register new user', description: 'Create a new user account and return JWT tokens' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        schema: {
            example: {
                status: 'success',
                data: {
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    user: {
                        id: 2,
                        username: 'johndoe',
                        email: 'johndoe@example.com',
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: 'Username already exists',
        schema: {
            example: {
                status: 'error',
                statusCode: 409,
                message: { message: 'Username already exists', error: 'Conflict', statusCode: 409 },
                path: '/api/auth/register',
            },
        },
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    // ==========================================
    // POST /api/auth/refresh
    // ==========================================
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token', description: 'Get new access & refresh tokens using a valid refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Tokens refreshed successfully',
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
        description: 'Invalid or expired refresh token',
        schema: {
            example: {
                status: 'error',
                statusCode: 401,
                message: { message: 'Invalid or expired refresh token', error: 'Unauthorized', statusCode: 401 },
                path: '/api/auth/refresh',
            },
        },
    })
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    // ==========================================
    // POST /api/auth/change-password (Protected)
    // ==========================================
    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Change password', description: 'Change password for the currently logged-in user (requires JWT)' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
        schema: {
            example: {
                status: 'success',
                data: {
                    message: 'Password changed successfully',
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Current password is incorrect or user not authenticated',
        schema: {
            example: {
                status: 'error',
                statusCode: 401,
                message: { message: 'Current password is incorrect', error: 'Unauthorized', statusCode: 401 },
                path: '/api/auth/change-password',
            },
        },
    })
    async changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(req.user.userId, changePasswordDto);
    }

    // ==========================================
    // GET /api/auth/profile (Protected)
    // ==========================================
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current user profile', description: 'Return profile of the currently logged-in user (requires JWT)' })
    @ApiResponse({
        status: 200,
        description: 'Profile retrieved successfully',
        schema: {
            example: {
                status: 'success',
                data: {
                    id: 1,
                    username: 'admin',
                    email: 'admin@example.com',
                    createdAt: '2026-08-10T07:55:58.000Z',
                    updatedAt: '2026-08-10T07:55:58.000Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token missing or invalid',
        schema: {
            example: {
                status: 'error',
                statusCode: 401,
                message: { message: 'Unauthorized', statusCode: 401 },
                path: '/api/auth/profile',
            },
        },
    })
    async getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.userId);
    }
}