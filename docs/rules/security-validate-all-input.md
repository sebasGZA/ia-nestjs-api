# security-validate-all-input

**Categoría**: Security  
**Impacto**: HIGH  
**Prefijo**: `security-`

## Descripción

Valida toda la entrada con `class-validator` y `ValidationPipe` global.

## Por Qué Importa

- Previene inyección de código
- Asegura integridad de datos
- Respuestas de error claras al cliente

## Implementación

### DTOs: `src/auth/dto/register.dto.ts`

```typescript
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
```

### ValidationPipe Global: `src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Elimina propiedades no declaradas
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true,           // Transforma payloads a DTOs
    }),
  );

  await app.listen(port);
}
```

## Decoradores Disponibles

| Decorador | Propósito |
|-----------|-----------|
| `@IsString()` | Validar tipo string |
| `@IsEmail()` | Validar formato email |
| `@IsNotEmpty()` | No permitir vacío |
| `@MinLength(n)` | Longitud mínima |
| `@MaxLength(n)` | Longitud máxima |
| `@IsOptional()` | Campo opcional |
| `@IsIn([...])` | Valores permitidos |
