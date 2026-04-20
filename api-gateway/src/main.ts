import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from '@/app.module';
import type { AppConfig } from '@/config/configuration';

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<AppConfig, true>);

  const port = config.get('port', { infer: true });
  const corsOrigins = config.get('corsOrigins', { infer: true });
  const apiPrefix = config.get('apiPrefix', { infer: true });

  app.use(helmet());
  app.enableCors({ origin: corsOrigins, credentials: true });
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('api-gateway')
    .setDescription('Gateway HTTP API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);
  Logger.log(
    `api-gateway listening on :${port} (prefix=/${apiPrefix}, cors=${corsOrigins.join(',')})`,
    'Bootstrap',
  );
}

void bootstrap();
