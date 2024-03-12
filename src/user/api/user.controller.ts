import { Controller, Post, Get, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../infrastructure/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../infrastructure/entities/user.entity';
import axios from 'axios';
import { FileService } from '../../file/file.service';
import { ProducerService } from 'src/producer.service';

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post('/users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get('/user/:userId')
  async getUser(@Param('userId') userId: string): Promise<any> {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    return response.data;
  }

  @Get('/user/:userId/avatar')
  async getUserAvatar(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
    const avatar = await this.fileService.getAvatar(userId);
    if (avatar) {
      res.status(HttpStatus.OK).send(avatar.base64);
    } else {
      const response = await axios.get(`https://reqres.in/api/users/${userId}`);
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
