import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ collection: 'Player' })  // Collection name in MongoDB
export class Player {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  age: number;

  @Prop()
  current_form: string;

  @Prop()
  ai_recommendation: string;

  @Prop()
  status: string;

  @Prop({ required: true ,ref:'Team'})
  team_id: number; // Foreign key reference to Team

  @Prop()
  technical_skills: number;

  @Prop()
  athleticism: number;

  @Prop()
  game_iq: number;

  @Prop()
  work_rate:number;

  @Prop()
  versatility:number;

  @Prop()
  player_number:number;

  @Prop()
  pos:string;

  @Prop()
  player_prompt:string;

  @Prop()
  awareia_insight:string;

  @Prop()
  fitness:string;

  @Prop({ type: [String] })
  key_strengths: string[];

  @Prop({ type: Types.ObjectId, ref: 'Player' })
  alternative_options: Types.ObjectId;

  @Prop({ type: Date, default: null })
  expected_return_date: Date | null;

}

export const PlayerSchema = SchemaFactory.createForClass(Player);
