import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MlInterviewDocument = MlInterview & Document;

@Schema({ collection: 'ml-interview' })
export class MlInterview {
  @Prop({ required: true })
  fixture_id: number;

  @Prop({ required: true })
  coach_team_name: string;

  @Prop({ required: true })
  interview: string;
}

export const MlInterviewSchema = SchemaFactory.createForClass(MlInterview);
