import { ConfigService } from '@nestjs/config';
import { ThrottlerOptions } from '@nestjs/throttler';

export const getThrottlerConfig = (
  config: ConfigService,
): ThrottlerOptions[] => {
  const ttl = config.get<number>('RATE_LIMIT_TTL') || 60000;
  const limit = config.get<number>('RATE_LIMIT_MAX') || 10;

  return [
    {
      ttl,
      limit,
    },
  ];
};

export const getCorsConfig = (config: ConfigService) => {
  const origin = config.get<string>('CORS_ORIGIN') || 'http://localhost:3000';

  return {
    origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  };
};

export const getJwtConfig = (config: ConfigService) => ({
  secret: config.getOrThrow<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: parseInt(config.get<string>('JWT_EXPIRATION') || '3600', 10),
  },
});
