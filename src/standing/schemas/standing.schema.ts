import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StandingDocument = Standing & Document;

@Schema({ collection: 'Standing' })
export class Standing {
    @Prop({ required: true })
    d: string;
    
  @Prop()
  ga: string; // Matches "Team Name" from DB

  @Prop()
  gd: string;

  @Prop()
  gf: string;

  @Prop()
  l: string;

  @Prop()
  mp: string;

  @Prop()
  pts: string;

  @Prop()
  position: string;

  @Prop()
  team_id: number;

  @Prop()
  tournament_id: number;

  @Prop()
  w: string;
}

export const StandingSchema = SchemaFactory.createForClass(Standing);