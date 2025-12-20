import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ collection: 'Match' })
export class Match {

  @Prop({ required: true })
  _id: number;

  @Prop()
  end_results?: string;

  @Prop()
  losing_team?: number;

  @Prop({ required: true })
  match_away_team: number;

  @Prop()
  match_division?: string;

  @Prop({ required: true })
  match_home_team: number;

  @Prop()
  match_location?: string;

  @Prop()
  match_result?: string;

  @Prop({ required: true })
  match_time: Date;

  @Prop()
  winning_team?: number;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
