import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastructure/entities/user.entity';
import { UserService } from './infrastructure/user.service';
import { UserController } from './api/user.controller';
import { FileModule } from 'src/file/file.module';
import { ProducerService } from 'src/producer.service';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { Constants } from 'src/constants';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FileModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.registerAsync([
      {
        name: Constants.RABBITMQ_SERVICE_NAME,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABBITMQ_URI') as string],
            queue: configService.get('USER_QUEUE_NAME', 'user_queue'),
            queueOptions: {
              durable: false,
            },
          },
        }) as ClientProvider,
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ProducerService,
    EmailService,
  ],
  exports: [UserService],
})

export class UserModule {}
