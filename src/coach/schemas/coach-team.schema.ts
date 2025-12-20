import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';


export type CoachTeamDocument = CoachTeam & Document;

@Schema({ timestamps: true })
export class CoachTeam {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true })
  coach_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  team_id: number;

  @Prop({required:true})
  league_id:number
}

export const CoachTeamSchema = SchemaFactory.createForClass(CoachTeam);
