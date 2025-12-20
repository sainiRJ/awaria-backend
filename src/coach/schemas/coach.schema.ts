import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type CoachDocument = Coach & Document;

@Schema({ timestamps: true })
export class Coach {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  
  @Prop({})
  role: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true })
  // leagueId: mongoose.Types.ObjectId;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true })
  // teamId: mongoose.Types.ObjectId;

  @Prop({required:true,ref:'Team'})
  teamId:number

  @Prop({required:true,ref:'Team'})
  leagueId:number

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false })
  otp?: string;
}

export const CoachSchema = SchemaFactory.createForClass(Coach);
