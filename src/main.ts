import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'typeorm';
import swagger from './swagger';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);

  app.use(
    session({
      name: 'session',
      secret: 'secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 36000000,
      },
    }),
  );

  swagger(app);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(config.get('APP_PORT'));
}
bootstrap();
