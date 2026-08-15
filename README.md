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
| Admin | +998901234567 | admin123 |
| User | +998901234568 | user123456 |

## Roles

- **ADMIN**: Full access to all endpoints
- **USER**: Regular user access

## Git Workflow

### Development

```bash
git checkout dev
# Make changes
git add .
git commit -m "feat: your feature"
git push origin dev
```

### Production Deployment

```bash
git checkout main
git merge dev
git push origin main
```

Pushing to `main` triggers automatic deployment on Render.

## Deployment (Render)

### Environment Variables

Set these in Render Dashboard:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CORS_ORIGIN` | Allowed origins (e.g., `*` or your frontend URL) |

### Automatic Deployment

- **Production Branch**: `main`
- **Auto Deploy**: Enabled
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && npm run start:prod`

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

## License

UNLICENSED
