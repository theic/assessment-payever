import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createWriteStream, unlinkSync } from 'fs';
import axios from 'axios';
import { Avatar, AvatarDocument } from '../../user/infrastructure/entities/avatar.entity';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(Avatar.name) private readonly avatarModel: Model<AvatarDocument>,
  ) {}

  async getAvatar(userId: string): Promise<Avatar | null> {
    return this.avatarModel.findOne({ userId }).exec();
  }

  async saveAvatar(userId: string, avatarUrl: string): Promise<string> {
    const response = await axios.get(avatarUrl, { responseType: 'stream' });
    const fileName = `${userId}_avatar.jpg`;
    const filePath = `./uploads/${fileName}`;

    const writeStream = createWriteStream(filePath);
    response.data.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    const base64Avatar = await this.convertToBase64(filePath);

    const avatar = new this.avatarModel({
      userId,
      fileName,
      base64: base64Avatar,
    });
    await avatar.save();

    return base64Avatar;
  }

  async deleteAvatar(userId: string): Promise<void> {
    const avatar = await this.avatarModel.findOne({ userId }).exec();
    if (!avatar) {
      return;
    }
    const filePath = `./uploads/${avatar.fileName}`;
    unlinkSync(filePath);
    await avatar.deleteOne();
  }

  private async convertToBase64(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const base64Data = data.toString('base64');
          resolve(`data:image/jpeg;base64,${base64Data}`);
        }
      });
    });
  }
}
