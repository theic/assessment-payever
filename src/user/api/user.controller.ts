import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Response } from 'express';
import { FileService } from '../../file/infrastructure';
import { UserService } from '../infrastructure';
import { CreateUserDto } from './dto/create-user.dto';

export interface UserOutputDto {
  readonly name: string;
  readonly email: string;
}

export interface ExternalUserOutputDto {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  support: {
    url: string;
    text: string;
  };
}

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserOutputDto> {
    const user = await this.userService.create(createUserDto);
    return {
      email: user.email,
      name: user.name,
    };
  }

  @Get('/user/:userId')
  async getExternalUser(@Param('userId') userId: string): Promise<any> {
    const externalUrl = this.configService.get('REQRES_BASE_URL');
    const response = await axios.get(`${externalUrl}/users/${userId}`);
    return response.data;
  }

  @Get('/user/:userId/avatar')
  async getUserAvatar(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const avatar = await this.fileService.getAvatar(userId);
    if (avatar) {
      res.status(HttpStatus.OK).send(avatar.base64);
    } else {
      const externalUrl = this.configService.get('REQRES_BASE_URL');
      const response = await axios.get(`${externalUrl}/users/${userId}`);
      const avatarUrl = response.data.data.avatar;
      const base64Avatar = await this.fileService.saveAvatar(userId, avatarUrl);
      res.status(HttpStatus.OK).send(base64Avatar);
    }
  }

  @Delete('/user/:userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string): Promise<void> {
    await this.fileService.deleteAvatar(userId);
  }
}
