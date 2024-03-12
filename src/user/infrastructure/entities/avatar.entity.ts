import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  base64: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
