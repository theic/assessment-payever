import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Avatar, User, UserService } from '../infrastructure';
import { FileService } from '../../file/infrastructure';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';

jest.mock('axios');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let fileService: FileService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            getAvatar: jest.fn(),
            saveAvatar: jest.fn(),
            deleteAvatar: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    fileService = moduleRef.get<FileService>(FileService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
      };
      const user: User = {
        email: 'test@example.com',
        name: 'John Doe',
      };
      jest.spyOn(userService, 'create').mockResolvedValue(user);

      const result = await userController.createUser(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        email: user.email,
        name: user.name,
      });
    });
  });

  describe('getExternalUser', () => {
    it('should get an external user', async () => {
      const userId = '1';
      const externalUrl = 'https://reqres.in/api';
      const externalUserData = {
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          avatar: 'https://example.com/avatar.jpg',
        },
        support: {
          url: 'https://reqres.in/#support-heading',
          text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
        },
      };
      jest.spyOn(configService, 'get').mockReturnValue(externalUrl);
      (axios.get as jest.Mock).mockResolvedValue({ data: externalUserData });

      const result = await userController.getExternalUser(userId);

      expect(configService.get).toHaveBeenCalledWith('REQRES_BASE_URL');
      expect(axios.get).toHaveBeenCalledWith(`${externalUrl}/users/${userId}`);
      expect(result).toEqual(externalUserData);
    });
  });

  describe('getUserAvatar', () => {
    it('should get the user avatar from the file service', async () => {
      const userId = '1';
      const avatar: Avatar = {
        userId: '1',
        fileName: 'avatar.jpg',
        base64: 'base64-avatar',
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      jest.spyOn(fileService, 'getAvatar').mockResolvedValue(avatar);

      await userController.getUserAvatar(userId, response as any);

      expect(fileService.getAvatar).toHaveBeenCalledWith(userId);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith(avatar.base64);
    });

    it('should get the user avatar from the external service if not found in the file service', async () => {
      const userId = '1';
      const externalUrl = 'https://reqres.in/api';
      const externalUserData = {
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          avatar: 'https://example.com/avatar.jpg',
        },
      };
      const base64Avatar = 'base64-avatar';
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      jest.spyOn(fileService, 'getAvatar').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockReturnValue(externalUrl);
      (axios.get as jest.Mock).mockResolvedValue({ data: externalUserData });
      jest.spyOn(fileService, 'saveAvatar').mockResolvedValue(base64Avatar);

      await userController.getUserAvatar(userId, response as any);

      expect(fileService.getAvatar).toHaveBeenCalledWith(userId);
      expect(configService.get).toHaveBeenCalledWith('REQRES_BASE_URL');
      expect(axios.get).toHaveBeenCalledWith(`${externalUrl}/users/${userId}`);
      expect(fileService.saveAvatar).toHaveBeenCalledWith(userId, externalUserData.data.avatar);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith(base64Avatar);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should delete the user avatar', async () => {
      const userId = '1';
      jest.spyOn(fileService, 'deleteAvatar').mockResolvedValue(undefined);

      await userController.deleteUserAvatar(userId);

      expect(fileService.deleteAvatar).toHaveBeenCalledWith(userId);
    });
  });
});
