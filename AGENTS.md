# AGENTS.md

## Project

NestJS starter app (v11) — single-module TypeScript server with TypeORM and PostgreSQL.

## Project Structure

```
src/
├── config/              # Configuration (database.config.ts)
├── database/            # Database module (database.module.ts)
├── entities/            # TypeORM entities (user.entity.ts)
├── migrations/          # Database migrations
├── app.module.ts        # Root module
├── app.controller.ts    # Root controller
├── app.service.ts       # Root service
└── main.ts              # Entry point
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
