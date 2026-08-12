import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { envValidationSchema } from './config/env.validation';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './common/redis/redis.module';
import { SearchModule } from './common/search/search.module';
import { FileUploadModule } from './common/file-upload/file-upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductsModule } from './modules/products/products.module';
import { BannersModule } from './modules/banners/banners.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SearchModule as ProductSearchModule } from './modules/search/search.module';
import { CompressionMiddleware } from './common/middleware/compression.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    RedisModule,
    SearchModule,
    FileUploadModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DashboardModule,
    HealthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    BannersModule,
    OrdersModule,
    ProductSearchModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CompressionMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
