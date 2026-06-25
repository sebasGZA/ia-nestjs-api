# devops-graceful-shutdown

**Categoría**: DevOps & Deployment  
**Impacto**: LOW-MEDIUM  
**Prefijo**: `devops-`

## Descripción

Implementa apagado graceful para despliegues sin downtime.

## Por Qué Importa

- Evita cortes en conexiones activas
- Permite completar requests en progreso
- Libera recursos correctamente

## Implementación

### En `src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  await app.listen(port);
}
```

## Señales Soportadas

| Señal | Comportamiento |
|-------|----------------|
| `SIGTERM` | Apagado graceful (Docker, K8s) |
| `SIGINT` | Ctrl+C en terminal |

## Ciclo de Vida

```
1. Recibe SIGTERM/SIGINT
2. NestJS emite 'onApplicationShutdown'
3. Módulos ejecutan cleanup
4. Cierra conexiones HTTP
5. Cierra conexiones DB
6. Proceso termina
```
