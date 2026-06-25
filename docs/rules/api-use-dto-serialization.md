# api-use-dto-serialization

**Categoría**: API Design  
**Impacto**: MEDIUM  
**Prefijo**: `api-`

## Descripción

Usa DTOs de respuesta con `class-transformer` para controlar qué campos se exponen al cliente.

## Por Qué Importa

- Previene filtración de datos sensibles (passwords, tokens internos)
- Respuestas consistentes y predecibles
- Separación entre modelo de BD y modelo de respuesta

## Implementación

### DTO Base: `src/auth/dto/user-response.dto.ts`

```typescript
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
```

### DTO de Register: `src/auth/dto/register-response.dto.ts`

```typescript
import { Expose } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class RegisterResponseDto {
  @Expose()
  user: UserResponseDto;

  @Expose()
  access_token: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
```

### Uso en el Servicio

```typescript
// En auth.service.ts - el servicio retorna objetos que coinciden con los DTOs
return {
  user: {
    id: savedUser.id,
    name: savedUser.name,
    email: savedUser.email,
  },
  access_token: token,
};
```

## Decoradores Disponibles

| Decorador | Propósito |
|-----------|-----------|
| `@Expose()` | Incluir campo en serialización |
| `@Exclude()` | Excluir campo de serialización |
| `@Type()` | Transformar tipos anidados |
| `@Transform()` | Transformación personalizada |

## Nota

En esta implementación se usan DTOs como contratos de tipo (interfaces) para definir la forma de las respuestas. Los decoradores `@Expose()` y `@Exclude()` de `class-transformer` están disponibles si se necesita serialización declarativa en el futuro.
