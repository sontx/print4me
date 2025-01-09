import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: new RegExp(configService.allowedOrigin),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: 'x-available-quota, x-is-scaled',
    credentials: true,
  });
  const port = process.env.PORT ?? 8080;
  const logger = new Logger('bootstrap', { timestamp: true });
  logger.log(`Listening on ${port}`);
  await app.listen(port);
}
bootstrap();
