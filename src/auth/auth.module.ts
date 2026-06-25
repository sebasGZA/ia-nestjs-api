import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { User } from '../user/domain/user.entity';
import { getJwtConfig } from '../shared/config/security.config';
import { AUTH_SERVICE } from './domain/constants/auth.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getJwtConfig(config),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ttl: 300000,
      }),
    }),
  ],
  controllers: [AuthController],
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
