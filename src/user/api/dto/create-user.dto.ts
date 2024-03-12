import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  job?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  email: string;
}
