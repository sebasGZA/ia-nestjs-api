"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (config) => {
    const host = config.get('DB_HOST') || 'localhost';
    const port = config.get('DB_PORT') || 5432;
    const username = config.get('DB_USERNAME') || 'postgres';
    const password = config.get('DB_PASSWORD') || 'postgres';
    const database = config.get('DB_NAME') || 'postgres';
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
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map