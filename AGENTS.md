# AGENTS.md

## Project

NestJS starter app (v11) — single-module TypeScript server.

## Commands

```bash
npm install          # setup
npm run start:dev    # dev server (port 3000, watch mode)
npm run build        # compile to dist/
npm run test         # unit tests (src/**/*.spec.ts)
npm run test:e2e     # e2e tests (test/*.e2e-spec.ts)
npm run test:cov     # coverage report
npm run lint         # eslint --fix
npm run format       # prettier write
```

## Database

### Levantar PostgreSQL
docker compose up -d

### Migraciones
npm run migration:generate ./src/migrations/NombreMigracion  # generar desde entidades
npm run migration:run                                         # ejecutar pendientes
npm run migration:revert                                      # revertir última
npm run migration:create ./src/migrations/NombreMigracion     # crear vacía

## Conventions

- Single quotes, trailing commas (Prettier config in `.prettierrc`)
- `no-explicit-any` is OFF, floating-promises is warn
- Module system: `nodenext` (not CommonJS)
- `noImplicitAny: false` in tsconfig
