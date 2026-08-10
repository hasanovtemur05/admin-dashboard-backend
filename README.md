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