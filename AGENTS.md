# AGENTS.md

## Project

NestJS starter app (v11) — single-module TypeScript server with TypeORM and PostgreSQL.

## Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── dto/               # Data transfer objects
│   ├── guards/            # JWT guards
│   └── strategies/        # Passport strategies
├── config/                # Configuration
│   ├── database.config.ts
│   └── security.config.ts
├── database/              # Database module
├── entities/              # TypeORM entities
├── migrations/            # Database migrations
├── app.module.ts          # Root module
└── main.ts                # Entry point
```

## Commands

```bash
npm install             # setup
npm run build           # compile to dist/
npm run start           # start server
npm run start:dev       # dev server (port 3000, watch mode)
npm run start:debug     # debug server (watch mode)
npm run start:prod      # production server
npm run lint            # eslint --fix
npm run format          # prettier write
npm run test            # unit tests (src/**/*.spec.ts)
npm run test:watch      # unit tests in watch mode
npm run test:debug      # debug unit tests
npm run test:cov        # coverage report
npm run test:e2e        # e2e tests (test/*.e2e-spec.ts)
```

## Database

Uses PostgreSQL 16 via TypeORM.

### Levantar PostgreSQL
```bash
docker compose up -d
```

### Migraciones
```bash
npm run migration:generate ./src/migrations/NombreMigracion  # generar desde entidades
npm run migration:run                                         # ejecutar pendientes
npm run migration:revert                                      # revertir última
npm run migration:create ./src/migrations/NombreMigracion     # crear vacía
```

## Security

### Environment Variables
```env
# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=3600

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=10
```

### Security Features
- **Helmet**: HTTP security headers (CSP, HSTS, X-Frame-Options)
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Global throttling (configurable per environment)
- **JWT Authentication**: Bearer token validation
- **Input Validation**: Whitelist and forbidNonWhitelisted

### Protected Routes
Use `JwtAuthGuard` to protect routes:
```typescript
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected')
getProtectedResource() {
  return { message: 'This is protected' };
}
```

## Conventions

### Prettier
- Single quotes, trailing commas (config in `.prettierrc`)

### ESLint
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-floating-promises`: warn
- `@typescript-eslint/no-unsafe-argument`: warn
- `@typescript-eslint/no-unsafe-assignment`: off
- `@typescript-eslint/no-unsafe-call`: off
- `@typescript-eslint/no-unsafe-member-access`: off
- `@typescript-eslint/no-unsafe-return`: off

### TypeScript
- Module system: `nodenext` (not CommonJS)
- `noImplicitAny: false`
- `strictNullChecks: true`
- `strictBindCallApply: false`
- `noFallthroughCasesInSwitch: false`

## Tools

When you need to search docs, use `context7` tools.
