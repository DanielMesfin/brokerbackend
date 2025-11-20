// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    logger: ['error', 'warn', 'log']
  });
  
  // Security middlewares
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);

  // Initialize Swagger
  const options = new DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription('The social media API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  try {
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    console.log('Swagger UI available at: http://localhost:' + (process.env.PORT || 8888) + '/api');
  } catch (err) {
    console.error('Swagger initialization error:', err);
  }

  const port = process.env.PORT || 8888;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();