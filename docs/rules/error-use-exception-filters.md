# error-use-exception-filters

**Categoría**: Error Handling  
**Impacto**: HIGH  
**Prefijo**: `error-`

## Descripción

Centraliza el manejo de errores mediante filtros de excepciones globales para respuestas consistentes.

## Por Qué Importa

- Respuestas de error uniformes en toda la API
- Logging centralizado de errores
- Separación de lógica de manejo de errores de la lógica de negocio

## Implementación

### Archivo: `src/filters/http-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        error = (responseObj.error as string) || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    });
  }
}
```

### Registro en `src/main.ts`

```typescript
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
}
```

## Formato de Respuesta de Error

```json
{
  "statusCode": 409,
  "timestamp": "2026-06-25T10:00:00.000Z",
  "path": "/v1/auth/register",
  "method": "POST",
  "message": "Email already registered",
  "error": "Conflict"
}
```
