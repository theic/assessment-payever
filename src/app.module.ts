import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';

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
