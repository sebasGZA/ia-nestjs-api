# perf-use-caching

**Categoría**: Performance  
**Impacto**: HIGH  
**Prefijo**: `perf-`

## Descripción

Implementa caché para reducir consultas a la base de datos.

## Por Qué Importa

- Reduce latencia en consultas frecuentes
- Disminuye carga en la base de datos
- Mejora experiencia del usuario

## Implementación

### Dependencias

```bash
pnpm add @nestjs/cache-manager cache-manager
```

### Módulo: `src/auth/auth.module.ts`

```typescript
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ttl: 300000,  // 5 minutos
      }),
    }),
  ],
})
export class AuthModule {}
```

### Servicio: `src/auth/auth.service.ts`

```typescript
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto) {
    const cacheKey = `user_email_${email}`;
    let user = await this.cacheManager.get<User>(cacheKey);

    if (!user) {
      user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        await this.cacheManager.set(cacheKey, user, 300000);
      }
    }

    // ... resto de lógica
  }
}
```

## Estrategias de Caché

| Estrategia | TTL | Uso |
|------------|-----|-----|
| Write-through | 5 min | Datos que cambian poco |
| Write-behind | 10 min | Datos que cambian frecuentemente |
| Cache-aside | 3 min | Datos con patrones de lectura impredecibles |
