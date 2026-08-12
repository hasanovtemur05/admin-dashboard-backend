# Online Market Backend API

Uzum Market-like e-commerce backend built with NestJS, Prisma, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (RBAC)
- **Product Management**: CRUD operations with variants, images, and discounts
- **Category Tree**: Hierarchical categories with Redis caching
- **Search**: Full-text search with Meilisearch integration
- **Orders**: Order management with status tracking
- **Banners**: Promotional banners with scheduling
- **Weekly Products**: Curated weekly product selections
- **Dashboard**: Real-time statistics and analytics

## Tech Stack

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Search**: Meilisearch
- **Storage**: MinIO (S3-compatible)
- **Auth**: JWT (access + refresh tokens)

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## Quick Start

### 1. Clone and install dependencies

```bash
cd admin-dashboard-backend
npm install
```

### 2. Start services with Docker

```bash
npm run docker:up
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Meilisearch on port 7700
- MinIO on port 9000 (console on 9001)

### 3. Set up environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 4. Run database migrations

```bash
npm run prisma:migrate
```

### 5. Seed the database

```bash
npm run prisma:seed
```

### 6. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/api/health`

## Default Users

After seeding, the following users are available:

| Role | Phone | Password |
|------|-------|----------|
| Super Admin | +998901234567 | admin123 |
| Content Manager | +998901234568 | cm123456 |

## API Endpoints

### Public Endpoints

- `GET /api/categories` - Get category tree
- `GET /api/categories/:id/products` - Get products by category
- `GET /api/products` - Get all products
- `GET /api/products/weekly` - Get weekly products
- `GET /api/banners` - Get active banners
- `GET /api/search?q=...` - Search products

### Admin Endpoints (Requires JWT)

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/categories` - Create category
- `POST /api/admin/banners` - Create banner
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status

## Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Database Studio

```bash
npm run prisma:studio
```

## Project Structure

```
src/
├── common/
│   ├── file-upload/     # S3/MinIO file upload service
│   ├── redis/           # Redis caching service
│   └── search/          # Meilisearch service
├── config/              # Configuration and validation
├── database/            # Prisma database module
├── docs/                # Swagger documentation
└── modules/
    ├── auth/            # Authentication (JWT, login, register)
    ├── banners/         # Promotional banners
    ├── brands/          # Product brands
    ├── categories/      # Product categories
    ├── dashboard/       # Admin dashboard stats
    ├── health/          # Health check endpoint
    ├── orders/          # Order management
    ├── permissions/     # RBAC permissions
    ├── products/        # Products with variants and images
    ├── roles/           # User roles
    ├── search/          # Search functionality
    └── users/           # User management
```

## License

UNLICENSED
