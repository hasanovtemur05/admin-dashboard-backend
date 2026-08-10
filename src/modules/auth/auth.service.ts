import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user || user.password !== password) {
            return null;
        }
        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username, roles: [user.role?.name] };

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' } as any),
        };
    }

    async register(createUserDto: CreateUserDto) {
        const existingUser = await this.usersService.findByUsername(createUserDto.username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const user = await this.usersService.create(createUserDto);

        const payload = { sub: user.id, username: user.username, roles: [] };

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' } as any),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const newPayload = { sub: user.id, username: user.username, roles: payload.roles };

            return {
                accessToken: this.jwtService.sign(newPayload),
                refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' } as any),
            };
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.password !== changePasswordDto.currentPassword) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        await this.usersService.updatePassword(userId, changePasswordDto.newPassword);

        return { message: 'Password changed successfully' };
    }

    async getProfile(userId: number) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}