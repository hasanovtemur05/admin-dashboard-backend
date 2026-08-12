import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
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

  async validateUser(phone: string, password: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phone, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByPhone(
      createUserDto.phone,
    );
    if (existingUser) {
      throw new ConflictException('Phone number already exists');
    }

    if (createUserDto.email) {
      const existingEmail = await this.usersService.findByEmail(
        createUserDto.email,
      );
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
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

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      const newPayload = {
        sub: user.id,
        phone: user.phone,
        role: user.role,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, {
          expiresIn: this.configService.get('jwt.refreshExpiresIn'),
        }),
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

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
    await this.usersService.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
