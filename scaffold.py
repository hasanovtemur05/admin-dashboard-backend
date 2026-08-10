from pathlib import Path
import textwrap

base = Path('.')
files = {
    '.gitignore': textwrap.dedent('''
node_modules/
dist/
coverage/
.env
*.env.local
*.env.development.local
*.env.test.local
*.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
/.idea
.vscode/
*.db
prisma/dev.db
'''),
    '.env.example': textwrap.dedent('''
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=change-me
JWT_EXPIRES_IN=3600s
'''),
    '.env': textwrap.dedent('''
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=change-me
JWT_EXPIRES_IN=3600s
'''),
    'README.md': textwrap.dedent('''
# Admin Dashboard Backend

NestJS backend scaffold for an admin dashboard with Prisma, JWT authentication, and modular architecture.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma client and apply the database schema:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## Project structure

- `src/config` - application and environment configuration
- `src/common` - shared decorators, guards, interceptors, filters, pipes, middleware, and utils
- `src/database` - Prisma database integration
- `src/modules` - feature modules for auth, users, roles, permissions, dashboard and health
- `prisma` - schema and seed script
- `test` - unit and e2e test folders
'''),
    'src/main.ts': textwrap.dedent('''
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { setupSwagger } from './docs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());

    setupSwagger(app);

    const port = configService.get<number>('port') || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
'''),
    'src/app.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: envValidationSchema,
        }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        RolesModule,
        PermissionsModule,
        DashboardModule,
        HealthModule,
    ],
})
export class AppModule {}
'''),
    'src/config/configuration.ts': textwrap.dedent('''
export default () => ({
    port: Number(process.env.PORT) || 3000,
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'change-me',
        expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
    },
});
'''),
    'src/config/database.config.ts': textwrap.dedent('''
export default () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
});
'''),
    'src/config/env.validation.ts': textwrap.dedent('''
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('3600s'),
});
'''),
    'src/common/constants/app.constants.ts': textwrap.dedent('''
export const APP_CONSTANTS = {
    API_PREFIX: 'api',
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
};
'''),
    'src/common/types/common.types.ts': textwrap.dedent('''
export type JwtPayload = {
    sub: number;
    username: string;
    roles?: string[];
};
'''),
    'src/common/decorators/current-user.decorator.ts': textwrap.dedent('''
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
    },
);
'''),
    'src/common/decorators/permissions.decorator.ts': textwrap.dedent('''
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
'''),
    'src/common/guards/jwt-auth.guard.ts': textwrap.dedent('''
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}
'''),
    'src/common/guards/permissions.guard.ts': textwrap.dedent('''
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler()) || [];
        if (!requiredPermissions.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const permissions = user?.permissions ?? [];

        return requiredPermissions.every(permission => permissions.includes(permission));
    }
}
'''),
    'src/common/interceptors/logging.interceptor.ts': textwrap.dedent('''
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => this.logger.log(`${method} ${url} ${Date.now() - now}ms`)),
        );
    }
}
'''),
    'src/common/interceptors/response.interceptor.ts': textwrap.dedent('''
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => ({ status: 'success', data })));
    }
}
'''),
    'src/common/filters/global-exception.filter.ts': textwrap.dedent('''
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

        response.status(status).json({
            status: 'error',
            statusCode: status,
            message,
            path: request.url,
        });
    }
}
'''),
    'src/common/pipes/validation.pipe.ts': textwrap.dedent('''
import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

export class ValidationPipe extends NestValidationPipe {}
'''),
    'src/common/middleware/request-id.middleware.ts': textwrap.dedent('''
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        req.headers['x-request-id'] = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        next();
    }
}
'''),
    'src/common/utils/pagination.util.ts': textwrap.dedent('''
export function getPagination(page = 1, limit = 20) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    return { skip, take };
}
'''),
    'src/common/utils/date.util.ts': textwrap.dedent('''
export function formatDate(date: Date): string {
    return date.toISOString();
}
'''),
    'src/database/prisma.service.ts': textwrap.dedent('''
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
'''),
    'src/database/prisma.repository.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaRepository {
    constructor(public readonly prisma: PrismaService) {}
}
'''),
    'src/database/database.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { PrismaRepository } from './prisma.repository';
import { PrismaService } from './prisma.service';

@Module({
    providers: [PrismaService, PrismaRepository],
    exports: [PrismaService, PrismaRepository],
})
export class DatabaseModule {}
'''),
    'src/modules/auth/auth.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
            }),
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
    exports: [AuthService],
})
export class AuthModule {}
'''),
    'src/modules/auth/auth.controller.ts': textwrap.dedent('''
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
'''),
    'src/modules/auth/auth.service.ts': textwrap.dedent('''
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
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

        return {
            accessToken: this.jwtService.sign({ sub: user.id, username: user.username, roles: [user.role?.name] }),
        };
    }
}
'''),
    'src/modules/auth/dto/login.dto.ts': textwrap.dedent('''
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
'''),
    'src/modules/auth/dto/refresh-token.dto.ts': textwrap.dedent('''
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
'''),
    'src/modules/auth/dto/change-password.dto.ts': textwrap.dedent('''
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}
'''),
    'src/modules/auth/strategies/jwt.strategy.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.secret'),
        });
    }

    validate(payload: any) {
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }
}
'''),
    'src/modules/auth/strategies/refresh-token.strategy.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor() {
        super();
    }

    validate(req: any): any {
        const refreshToken = req.body?.refreshToken;
        return refreshToken ? { refreshToken } : null;
    }
}
'''),
    'src/modules/users/users.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
'''),
    'src/modules/users/users.controller.ts': textwrap.dedent('''
import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(@Query() query: QueryUserDto) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(Number(id));
    }
}
'''),
    'src/modules/users/users.service.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async findByUsername(username: string) {
        return this.usersRepository.findByUsername(username);
    }

    async findById(id: number) {
        return this.usersRepository.findById(id);
    }

    async findAll(query: QueryUserDto) {
        return this.usersRepository.findAll(query);
    }

    async create(data: CreateUserDto) {
        return this.usersRepository.create(data);
    }
}
'''),
    'src/modules/users/users.repository.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
    constructor(private readonly prismaRepository: PrismaRepository) {}

    findByUsername(username: string) {
        return this.prismaRepository.prisma.user.findUnique({ where: { username } });
    }

    findById(id: number) {
        return this.prismaRepository.prisma.user.findUnique({ where: { id } });
    }

    findAll(query: { page?: number; limit?: number }) {
        const take = Number(query.limit ?? 20);
        const skip = (Number(query.page ?? 1) - 1) * take;
        return this.prismaRepository.prisma.user.findMany({ take, skip });
    }

    create(data: CreateUserDto) {
        return this.prismaRepository.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        });
    }
}
'''),
    'src/modules/users/interfaces/user-repository.interface.ts': textwrap.dedent('''
export interface UserRepository {
    findByUsername(username: string): Promise<any>;
    findById(id: number): Promise<any>;
    findAll(query: any): Promise<any>;
    create(data: any): Promise<any>;
}
'''),
    'src/modules/users/dto/create-user.dto.ts': textwrap.dedent('''
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
'''),
    'src/modules/users/dto/update-user.dto.ts': textwrap.dedent('''
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;
}
'''),
    'src/modules/users/dto/query-user.dto.ts': textwrap.dedent('''
import { IsOptional, IsPositive } from 'class-validator';

export class QueryUserDto {
    @IsOptional()
    @IsPositive()
    page?: number;

    @IsOptional()
    @IsPositive()
    limit?: number;
}
'''),
    'src/modules/roles/roles.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
    imports: [DatabaseModule],
    controllers: [RolesController],
    providers: [RolesService, RolesRepository],
    exports: [RolesService],
})
export class RolesModule {}
'''),
    'src/modules/roles/roles.controller.ts': textwrap.dedent('''
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(Number(id));
    }

    @Post()
    create(@Body() payload: CreateRoleDto) {
        return this.rolesService.create(payload);
    }
}
'''),
    'src/modules/roles/roles.service.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}

    findAll() {
        return this.rolesRepository.findAll();
    }

    findOne(id: number) {
        return this.rolesRepository.findOne(id);
    }

    create(payload: CreateRoleDto) {
        return this.rolesRepository.create(payload);
    }
}
'''),
    'src/modules/roles/roles.repository.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesRepository {
    constructor(private readonly prismaRepository: PrismaRepository) {}

    findAll() {
        return this.prismaRepository.prisma.role.findMany({ include: { permissions: true } });
    }

    findOne(id: number) {
        return this.prismaRepository.prisma.role.findUnique({ where: { id }, include: { permissions: true } });
    }

    create(payload: CreateRoleDto) {
        return this.prismaRepository.prisma.role.create({
            data: {
                name: payload.name,
            },
        });
    }
}
'''),
    'src/modules/roles/dto/create-role.dto.ts': textwrap.dedent('''
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
'''),
    'src/modules/roles/dto/update-role.dto.ts': textwrap.dedent('''
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    name?: string;
}
'''),
    'src/modules/permissions/permissions.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';

@Module({
    imports: [DatabaseModule],
    controllers: [PermissionsController],
    providers: [PermissionsService, PermissionsRepository],
    exports: [PermissionsService],
})
export class PermissionsModule {}
'''),
    'src/modules/permissions/permissions.controller.ts': textwrap.dedent('''
import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get()
    findAll() {
        return this.permissionsService.findAll();
    }
}
'''),
    'src/modules/permissions/permissions.service.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
    constructor(private readonly permissionsRepository: PermissionsRepository) {}

    findAll() {
        return this.permissionsRepository.findAll();
    }
}
'''),
    'src/modules/permissions/permissions.repository.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../database/prisma.repository';

@Injectable()
export class PermissionsRepository {
    constructor(private readonly prismaRepository: PrismaRepository) {}

    findAll() {
        return this.prismaRepository.prisma.permission.findMany();
    }
}
'''),
    'src/modules/dashboard/dashboard.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
'''),
    'src/modules/dashboard/dashboard.controller.ts': textwrap.dedent('''
import { Controller, Get, Query } from '@nestjs/common';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    getSummary(@Query() query: DashboardQueryDto) {
        return this.dashboardService.getSummary(query);
    }
}
'''),
    'src/modules/dashboard/dashboard.service.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
    getSummary(query: DashboardQueryDto) {
        return {
            totalUsers: 12,
            activeSessions: 5,
            metrics: {
                page: query.page ?? 1,
                limit: query.limit ?? 10,
            },
        };
    }
}
'''),
    'src/modules/dashboard/dto/dashboard-query.dto.ts': textwrap.dedent('''
import { IsOptional, IsPositive } from 'class-validator';

export class DashboardQueryDto {
    @IsOptional()
    @IsPositive()
    page?: number;

    @IsOptional()
    @IsPositive()
    limit?: number;
}
'''),
    'src/modules/health/health.module.ts': textwrap.dedent('''
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
    controllers: [HealthController],
    providers: [HealthService],
})
export class HealthModule {}
'''),
    'src/modules/health/health.controller.ts': textwrap.dedent('''
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    check() {
        return this.healthService.check();
    }
}
'''),
    'src/modules/health/health.service.ts': textwrap.dedent('''
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
    check() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
}
'''),
    'src/docs/swagger.ts': textwrap.dedent('''
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Admin Dashboard API')
        .setDescription('Backend API for admin dashboard')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
}
'''),
    'prisma/schema.prisma': textwrap.dedent('''
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  roleId    Int?
  role      Role?    @relation(fields: [roleId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Role {
  id          Int          @id @default(autoincrement())
  name        String       @unique
  permissions Permission[]
  users       User[]
}

model Permission {
  id     Int   @id @default(autoincrement())
  name   String
  role   Role  @relation(fields: [roleId], references: [id])
  roleId Int
}
'''),
    'prisma/seed.ts': textwrap.dedent('''
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      roleId: adminRole.id,
    },
  });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
'''),
    'test/unit/.gitkeep': '',
    'test/e2e/.gitkeep': '',
}

for rel_path, content in files.items():
    path = base / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')

print('Scaffold files created.')
