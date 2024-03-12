import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailService } from './user/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get('MONGODB_URI')}${configService.get('MONGODB_NAME', 'nest')}`,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
