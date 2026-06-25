# di-use-interfaces-tokens

**Categoría**: Dependency Injection  
**Impacto**: CRITICAL  
**Prefijo**: `di-`

## Descripción

Usa tokens de inyección para interfaces, permitiendo desacoplamiento y testing más fácil.

## Por Qué Importa

- Desacoplamiento de implementaciones
- Testing con mocks más fácil
- Cambio de implementación sin modificar consumidores

## Implementación

### Token: `src/auth/constants/auth.constants.ts`

```typescript
export const AUTH_SERVICE = 'AUTH_SERVICE';
```

### Interfaz: `src/auth/interfaces/auth-service.interface.ts`

```typescript
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<{
    user: { id: string; name: string; email: string };
    access_token: string;
  }>;
  login(loginDto: LoginDto): Promise<{
    user: { id: string; name: string; email: string };
    access_token: string;
  }>;
}
```

### Módulo: `src/auth/auth.module.ts`

```typescript
import { AUTH_SERVICE } from './constants/auth.constants';

@Module({
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

### Servicio implementa interfaz: `src/auth/auth.service.ts`

```typescript
@Injectable()
export class AuthService implements IAuthService {
  async register(registerDto: RegisterDto) {
    // ...
  }

  async login(loginDto: LoginDto) {
    // ...
  }
}
```
