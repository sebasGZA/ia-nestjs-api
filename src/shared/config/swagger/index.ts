import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { v1DocumentConfig } from './v1.config';
import { applyV1Security } from './v1-security.scheme';

export function setupSwagger(app: INestApplication): void {
  // v1
  const v1Builder = new DocumentBuilder()
    .setTitle(v1DocumentConfig.title)
    .setDescription(v1DocumentConfig.description)
    .setVersion(v1DocumentConfig.version)
    .addBearerAuth();

  for (const tag of v1DocumentConfig.tags) {
    v1Builder.addTag(tag.name, tag.description);
  }

  const v1Document = SwaggerModule.createDocument(app, v1Builder.build());
  applyV1Security(v1Document);
  SwaggerModule.setup('docs/v1', app, v1Document);

  Logger.log(`Swagger v1 docs available at /docs/v1`, 'Swagger');
}
