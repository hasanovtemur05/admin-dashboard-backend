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

    // Enable CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    // Global pipes
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global filters
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new ResponseInterceptor(),
    );

    // Swagger documentation
    setupSwagger(app);

    const port = configService.get<number>('port') || 3000;

    await app.listen(port, '0.0.0.0');

    console.log(`Application is running on: http://localhost:${port}/api`);
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();