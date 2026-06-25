import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = parseInt(process.env.PORT!, 10)
  await app.listen(port, () => {
    Logger.log(`Server is running on port ${port}`, 'main')
  });
}
void bootstrap();
