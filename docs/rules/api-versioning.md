# api-versioning

**Categoría**: API Design  
**Impacto**: MEDIUM  
**Prefijo**: `api-`

## Descripción

Implementa versionado de API para cambios backward-compatible sin romper clientes existentes.

## Por Qué Importa

- Evita breaking changes para clientes existentes
- Permite evolución gradual de la API
- Facilita deprecation de versiones antiguas

## Implementación

### Configuración en `src/main.ts`

```typescript
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(port);
}
```

### Controlador: `src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus, Version } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

## Endpoints

| Versión | Endpoint | Estado |
|---------|----------|--------|
| v1 | `POST /v1/auth/register` | Activo |
| v1 | `POST /v1/auth/login` | Activo |
| v2 | `POST /v2/auth/register` | Futuro |
