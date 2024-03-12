import { IsString } from 'class-validator';

export class UserIdParam {
  @IsString()
  userId: string;
}
