import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => {
  const host = config.get<string>('DB_HOST') || 'localhost';
  const port = config.get<number>('DB_PORT') || 5432;
  const username = config.get<string>('DB_USERNAME') || 'postgres';
  const password = config.get<string>('DB_PASSWORD') || 'postgres';
  const database = config.get<string>('DB_NAME') || 'postgres';

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsTableName: '_migrations',
    synchronize: false,
    logging: ['error', 'warn'],
  };
};
