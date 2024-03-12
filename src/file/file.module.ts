import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from '../user/infrastructure/entities/avatar.entity';
import { FileService } from './infrastructure/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
  ],
  providers: [FileService],
  exports: [FileService],
})

export class FileModule {}
