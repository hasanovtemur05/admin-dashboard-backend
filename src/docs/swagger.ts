import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const isProduction = process.env.NODE_ENV === 'production';
  const renderUrl =
    process.env.RENDER_EXTERNAL_URL ||
    'https://admin-dashboard-backend-0thp.onrender.com';
  const localUrl = `http://localhost:${process.env.PORT || 3000}`;

  const config = new DocumentBuilder()
    .setTitle('Online Market API')
    .setDescription(
      `
# Online Market Backend API

Uzum Market-like e-commerce platform backend.

## Features
- **Authentication**: JWT-based auth with role-based access control
- **Products**: CRUD with variants, images, and discounts
- **Categories**: Hierarchical categories with Redis caching
- **Search**: Full-text search with Meilisearch
- **Orders**: Order management with status tracking
- **Banners**: Promotional banners with scheduling
- **Weekly Products**: Curated weekly product selections

## Authentication
All admin endpoints require JWT token. Use \`/api/auth/login\` to get access token.

## Roles
- \`ADMIN\` - Full access to all endpoints
- \`USER\` - Regular user access
        `,
    )
    .setVersion('1.0')
    .addServer(
      isProduction ? renderUrl : localUrl,
      isProduction ? 'Production Server' : 'Local Development Server',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Dashboard', 'Admin dashboard statistics')
    .addTag('Users', 'User management')
    .addTag('Categories', 'Product categories')
    .addTag('Brands', 'Product brands')
    .addTag('Products', 'Product management')
    .addTag('Banners', 'Promotional banners')
    .addTag('Orders', 'Order management')
    .addTag('Search', 'Product search')
    .addTag('Health', 'Health check endpoints')
    .addTag('Roles', 'Role management')
    .addTag('Permissions', 'Permission management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Online Market API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
  });
}
