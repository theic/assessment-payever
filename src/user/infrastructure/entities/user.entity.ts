import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  job: string;

  @Prop()
  avatar: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);