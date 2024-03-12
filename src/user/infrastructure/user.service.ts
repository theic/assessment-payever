import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities';
import { ProducerService } from './producer.service';
import { CreateUserDto } from '../api/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly producerService: ProducerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    await this.producerService.sendMessage('user_created', JSON.stringify(savedUser));
    return savedUser;
  }

  async findOne(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async update(userId: string, updateUserDto: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
  }

  async remove(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
