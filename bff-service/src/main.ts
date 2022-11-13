import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

const port = process.env.PORT || 3001;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(helmet());

  await app.listen(port);
}

bootstrap();
