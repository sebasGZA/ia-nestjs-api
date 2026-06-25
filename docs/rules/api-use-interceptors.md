# api-use-interceptors

**Categoría**: API Design  
**Impacto**: MEDIUM  
**Prefijo**: `api-`

## Descripción

Usa interceptores para lógica transversal como logging, métricas, y transformación de respuestas.

## Por Qué Importa

- Separación de concerns (logging, cache, métricas)
- Reutilización de lógica横切的 (transversal)
- Punto central para métricas y monitoreo

## Implementación

### Archivo: `src/interceptors/logging.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const userId = request.user?.id || 'anonymous';
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        this.logger.log(
          `${method} ${url} ${userId} ${elapsed}ms`,
        );
      }),
    );
  }
}
```

### Registro en `src/main.ts`

```typescript
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port);
}
```

## Ejemplo de Log

```
[LoggingInterceptor] POST /v1/auth/register anonymous 45ms
[LoggingInterceptor] POST /v1/auth/login 123e4567-e89b-12d3-a456-426614174000 32ms
```
