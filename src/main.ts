import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const logger = new Logger('NestApplication');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Redirect root "/"" to "/graphql/"
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/graphql/');
  });

  await app.listen(3000);
  logger.log('Nest application is running on: http://localhost:3000/');
}
bootstrap();
