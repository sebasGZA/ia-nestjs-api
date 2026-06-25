# db-use-migrations

**Categoría**: Database & ORM  
**Impacto**: MEDIUM-HIGH  
**Prefijo**: `db-`

## Descripción

Usa migraciones para cambios de esquema en lugar de sincronización automática.

## Por Qué Importa

- Control de versiones del esquema de BD
- Reproducibilidad en diferentes ambientes
- Rollback seguro de cambios

## Implementación

### Migración Corregida: `src/migrations/1782360156976-user-entity.ts`

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntity1782360156976 implements MigrationInterface {
  name = 'UserEntity1782360156976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

### Comandos de Migración

```bash
pnpm run migration:generate ./src/migrations/NuevaMigracion  # Generar desde entidades
pnpm run migration:run                                         # Ejecutar pendientes
pnpm run migration:revert                                      # Revertir última
```

## Configuración: `src/config/database.config.ts`

```typescript
return {
  type: 'postgres',
  synchronize: false,  // Nunca usar en producción
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: '_migrations',
};
```
