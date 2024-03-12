import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const userQueueName = configService.get('USER_QUEUE_NAME', 'user_queue');
  const httpPort = configService.get('HTTP_PORT', 3000);
  const rabbitmqUri = configService.get('RABBITMQ_URI');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUri],
      queue: userQueueName,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);
}
bootstrap();