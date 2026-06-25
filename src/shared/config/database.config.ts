import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => {
  const host = config.get<string>('DB_HOST');
  const port = config.get<number>('DB_PORT');
  const username = config.get<string>('DB_USERNAME');
  const password = config.get<string>('DB_PASSWORD');
  const database = config.get<string>('DB_NAME');

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
