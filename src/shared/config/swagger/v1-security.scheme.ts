import type { OpenAPIObject } from '@nestjs/swagger';

export const BearerAuthSecurityScheme = {
  bearerFormat: 'JWT',
  description:
    'Enter your JWT token (obtained from /v1/auth/register or /v1/auth/login)',
  type: 'http' as const,
  scheme: 'bearer' as const,
};

export function applyV1Security(document: OpenAPIObject): void {
  document.components = {
    ...document.components,
    securitySchemes: {
      bearerAuth: BearerAuthSecurityScheme,
    },
  };
}
