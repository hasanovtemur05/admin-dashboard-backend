import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const isProduction = process.env.NODE_ENV === 'production';
    const renderUrl = process.env.RENDER_EXTERNAL_URL || 'https://admin-dashboard-backend-0thp.onrender.com';
    const localUrl = `http://localhost:${process.env.PORT || 3000}`;

    const config = new DocumentBuilder()
        .setTitle('Admin Dashboard API')
        .setDescription('Backend API for admin dashboard')
        .setVersion('1.0')
        .addServer(isProduction ? renderUrl : localUrl, isProduction ? 'Production Server' : 'Local Development Server')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        }, 'JWT-auth')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
}