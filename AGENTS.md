# AGENTS.md

## Project

NestJS starter app (v11) — single-module TypeScript server with TypeORM and PostgreSQL.

## Project Structure

```
src/
├── auth/                          # Authentication module
│   ├── auth.module.ts             # Composition root
│   ├── application/               # Use cases & orchestration
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.service.spec.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── domain/                    # Core contracts (zero framework deps)
│   │   ├── constants/
│   │   │   └── auth.constants.ts
│   │   └── interfaces/
│   │       ├── auth-service.interface.ts
│   │       ├── auth-login.interface.ts
│   │       └── auth-register.interface.ts
│   └── infrastructure/            # External I/O (HTTP, DTOs)
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   └── auth.controller.spec.ts
│       └── dto/
│           ├── login.dto.ts
│           ├── login-response.dto.ts
│           ├── register.dto.ts
│           ├── register-response.dto.ts
│           └── user-response.dto.ts
├── user/                          # User module (partial)
│   └── domain/
│       └── user.entity.ts
├── shared/                        # Shared utilities
│   ├── config/
│   │   ├── database.config.ts
│   │   └── security.config.ts
│   ├── database/
│   │   └── database.module.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── interceptors/
│       └── logging.interceptor.ts
├── migrations/                    # Database migrations
├── app.module.ts                  # Root module
└── main.ts                        # Entry point
```

## Module Architecture Pattern

Every feature module follows **Layered DDD (Domain-Driven Design)** adapted to NestJS. The architecture enforces a strict dependency direction: outer layers depend on inner layers, never the reverse.

### Overview

```
+-----------------------------------------------------------+
|                   infrastructure/                          |
|  (Controllers, DTOs -- external I/O, HTTP handlers)       |
+-----------------------------------------------------------+
|                   application/                             |
|  (Services, Guards, Strategies -- use cases & logic)      |
+-----------------------------------------------------------+
|                     domain/                                |
|  (Interfaces, Constants, Entities -- pure contracts)      |
+-----------------------------------------------------------+
```

### Layer 1: domain/ -- The Core

**Purpose:** Pure domain contracts and constants with **zero framework dependencies**. Nothing here imports from NestJS, TypeORM, Passport, or any infrastructure concern.

| Subfolder | Contents | Examples |
|-----------|----------|----------|
| `interfaces/` | Contracts that the application service must implement | `IAuthService`, `IAuthLogin`, `IAuthRegister` |
| `constants/` | Injection tokens for NestJS DI | `AUTH_SERVICE = 'AUTH_SERVICE'` |
| `entities/` | Domain entities (if shared across modules) | `User` entity |

**Rules:**
- No imports from `@nestjs/*`, `typeorm`, `passport`, or any infrastructure package.
- Interfaces use `I` prefix: `IAuthService`, `IUserService`.
- Constants use `SCREAMING_SNAKE_CASE`: `AUTH_SERVICE`, `USER_REPOSITORY`.

### Layer 2: application/ -- Use Cases & Orchestration

**Purpose:** Business logic orchestration, use-case implementations, and reusable application-level concerns. Depends on the domain layer for interfaces and on NestJS for DI.

| Subfolder | Contents | Examples |
|-----------|----------|----------|
| `services/` | Core use-case orchestrators + unit tests | `AuthService`, `auth.service.spec.ts` |
| `guards/` | NestJS guards for route protection | `JwtAuthGuard` |
| `strategies/` | Passport strategies | `JwtStrategy` |

**Rules:**
- Services implement domain interfaces: `AuthService implements IAuthService`.
- Unit tests are colocated next to source files (not in a separate `test/` directory).
- Services use DI tokens from domain/constants, not concrete classes directly.

### Layer 3: infrastructure/ -- External Interface & Data Transfer

**Purpose:** External-facing concerns: HTTP controllers (entry points) and data transfer objects (input validation, output serialization). The outermost layer.

| Subfolder | Contents | Examples |
|-----------|----------|----------|
| `controllers/` | NestJS HTTP controllers + unit tests | `AuthController`, `auth.controller.spec.ts` |
| `dto/` | Input validation (class-validator) and output serialization (class-transformer) | `LoginDto`, `LoginResponseDto` |

**Rules:**
- Controllers delegate ALL logic to services. Controllers contain zero business logic.
- Input DTOs implement domain interfaces: `LoginDto implements IAuthLogin`.
- Output DTOs use `class-transformer` decorators: `@Expose()`, `@Exclude()`.
- Unit tests are colocated next to source files.

### Composition Root: {module}.module.ts

The NestJS module definition at the root of each module is the **composition root** -- the only place where concrete implementations are bound to their abstractions.

```typescript
@Module({
  imports: [/* other modules */],
  controllers: [/* infrastructure controllers */],
  providers: [
    {
      provide: MODULE_SERVICE,     // DI token from domain/constants
      useClass: ModuleService,     // Concrete implementation
    },
    ModuleService,                 // Also register by class for internal use
    /* strategies, guards, etc. */
  ],
  exports: [ModuleService],        // Export for other modules
})
export class ModuleName {}
```

**Rules:**
- Always register services under their DI token for decoupling.
- Always export services and JWT module if other modules need them.
- Import `CacheModule` if caching is needed.

## Module Template

Use this template when creating a new module. Replace `{name}` with the module name (e.g., `product`, `order`).

```
src/{name}/
├── {name}.module.ts
├── domain/
│   ├── constants/
│   │   └── {name}.constants.ts
│   └── interfaces/
│       ├── {name}-service.interface.ts
│       └── {name}-create.interface.ts
├── application/
│   └── services/
│       ├── {name}.service.ts
│       └── {name}.service.spec.ts
└── infrastructure/
    ├── controllers/
    │   ├── {name}.controller.ts
    │   └── {name}.controller.spec.ts
    └── dto/
        ├── create-{name}.dto.ts
        └── {name}-response.dto.ts
```

### Template Files

#### `{name}.constants.ts`

```typescript
export const {NAME}_SERVICE = '{NAME}_SERVICE';
```

#### `{name}-service.interface.ts`

```typescript
export interface I{Name}Service {
  create(dto: I{Name}Create): Promise<{ id: string; /* fields */ }>;
  findAll(): Promise<{ id: string; /* fields */ }[]>;
}
```

#### `{name}-create.interface.ts`

```typescript
export interface I{Name}Create {
  /* domain fields, no framework decorators */
}
```

#### `{name}.service.ts`

```typescript
import { Injectable, Inject, Logger } from '@nestjs/common';
import { {NAME}_SERVICE } from '../domain/constants/{name}.constants';
import { I{Name}Service } from '../domain/interfaces/{name}-service.interface';

@Injectable()
export class {Name}Service implements I{Name}Service {
  private readonly logger = new Logger({Name}Service.name);

  constructor(/* injected dependencies */) {}

  async create(dto: I{Name}Create) {
    // implementation
  }

  async findAll() {
    // implementation
  }
}
```

#### `{name}.controller.ts`

```typescript
import { Controller, Post, Get, Body, Version } from '@nestjs/common';
import { {Name}Service } from '../application/services/{name}.service';

@Controller('{name}')
export class {Name}Controller {
  constructor(private readonly {name}Service: {Name}Service) {}

  @Post()
  @Version('1')
  async create(@Body() createDto: Create{Name}Dto) {
    return this.{name}Service.create(createDto);
  }

  @Get()
  @Version('1')
  async findAll() {
    return this.{name}Service.findAll();
  }
}
```

#### `{name}.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { {Name}Controller } from './infrastructure/controllers/{name}.controller';
import { {Name}Service } from './application/services/{name}.service';
import { {NAME}_SERVICE } from './domain/constants/{name}.constants';

@Module({
  controllers: [{Name}Controller],
  providers: [
    {
      provide: {NAME}_SERVICE,
      useClass: {Name}Service,
    },
    {Name}Service,
  ],
  exports: [{Name}Service],
})
export class {Name}Module {}
```

#### `create-{name}.dto.ts`

```typescript
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { I{Name}Create } from '../../domain/interfaces/{name}-create.interface';

export class Create{Name}Dto implements I{Name}Create {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
```

#### `{name}-response.dto.ts`

```typescript
import { Expose, Exclude } from 'class-transformer';

export class {Name}ResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Exclude()
  createdAt: Date;

  constructor(partial: Partial<{Name}ResponseDto>) {
    Object.assign(this, partial);
  }
}
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Interfaces | `I` prefix + PascalCase | `IAuthService`, `IUserCreate` |
| Input DTOs | `Create{Entity}Dto` or `{Action}{Entity}Dto` | `CreateUserDto`, `LoginDto` |
| Output DTOs | `{Entity}ResponseDto` | `UserResponseDto`, `LoginResponseDto` |
| Services | `{Entity}Service` | `AuthService`, `UserService` |
| Controllers | `{Entity}Controller` | `AuthController`, `UserController` |
| Guards | `{Purpose}Guard` | `JwtAuthGuard`, `RolesGuard` |
| Strategies | `{Strategy}Strategy` | `JwtStrategy`, `LocalStrategy` |
| Constants | `SCREAMING_SNAKE_CASE` | `AUTH_SERVICE`, `USER_REPOSITORY` |
| DI Tokens | `{MODULE}_SERVICE` | `AUTH_SERVICE`, `USER_SERVICE` |
| Files | `kebab-case` | `auth.service.ts`, `jwt-auth.guard.ts` |
| Test files | Colocated with source, `.spec.ts` suffix | `auth.service.spec.ts` |

## Commands

```bash
pnpm install             # setup
pnpm run build           # compile to dist/
pnpm run start           # start server
pnpm run start:dev       # dev server (port 3000, watch mode)
pnpm run start:debug     # debug server (watch mode)
pnpm run start:prod      # production server
pnpm run lint            # eslint --fix
pnpm run format          # prettier write
pnpm run test            # unit tests (src/**/*.spec.ts)
pnpm run test:watch      # unit tests in watch mode
pnpm run test:debug      # debug unit tests
pnpm run test:cov        # coverage report
pnpm run test:e2e        # e2e tests (test/*.e2e-spec.ts)
```

## Database

Uses PostgreSQL 16 via TypeORM.

### Start PostgreSQL
```bash
docker compose up -d
```

### Migrations
```bash
pnpm run migration:generate ./src/migrations/Name  # generate from entities
pnpm run migration:run                             # run pending
pnpm run migration:revert                          # revert last
pnpm run migration:create ./src/migrations/Name    # create empty
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
import { JwtAuthGuard } from './auth/application/guards/jwt-auth.guard';

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
