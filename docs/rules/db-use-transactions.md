# db-use-transactions

**Categoría**: Database & ORM  
**Impacto**: MEDIUM-HIGH  
**Prefijo**: `db-`

## Descripción

Usa transacciones de base de datos para operaciones que deben ser atómicas.

## Por Qué Importa

- Integridad de datos en operaciones múltiples
- Rollback automático en caso de error
- Consistencia en operaciones relacionadas

## Implementación

### Archivo: `src/auth/auth.service.ts`

```typescript
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return {
        user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
        access_token: this.generateToken(savedUser),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
```

## Flujo de Transacción

```
1. startTransaction()
   ├── INSERT users (name, email, password)
   ├── INSERT audit_log (user_id, action)
   └── commitTransaction()
       ├── Éxito → Persistir cambios
       └── Error → rollbackTransaction() → Revertir todo
```
