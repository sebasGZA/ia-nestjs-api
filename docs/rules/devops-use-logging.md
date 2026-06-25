# devops-use-logging

**Categoría**: DevOps & Deployment  
**Impacto**: LOW-MEDIUM  
**Prefijo**: `devops-`

## Descripción

Implementa logging estructurado para debugging y monitoreo.

## Por Qué Importa

- Debugging eficiente en producción
- Monitoreo de performance
- Auditoría de acciones

## Implementación

### Logger en Servicios: `src/auth/auth.service.ts`

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async register(registerDto: RegisterDto) {
    // ... lógica de registro
    this.logger.log(`User registered: ${savedUser.id}`);
  }

  async login(loginDto: LoginDto) {
    // ... lógica de login
    this.logger.log(`User logged in: ${user.id}`);
  }
}
```

### Logger en Interceptor: `src/interceptors/logging.interceptor.ts`

```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
  const request = context.switchToHttp().getRequest();
  const { method, url } = request;
  const userId = request.user?.id || 'anonymous';
  const now = Date.now();

  return next.handle().pipe(
    tap(() => {
      const elapsed = Date.now() - now;
      this.logger.log(`${method} ${url} ${userId} ${elapsed}ms`);
    }),
  );
}
```

### Niveles de Log

| Nivel | Uso |
|-------|-----|
| `log` | Información general |
| `warn` | Advertencias |
| `error` | Errores |
| `debug` | Debug detallado |
| `verbose` | Información muy detallada |
