import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeagueDocument = League & Document;

@Schema({ collection: 'League' })  // Ensure it matches your MongoDB collection name
export class League {
    @Prop({ required: true })
    _id: number;

  @Prop({ required: true })
  leagueTitle: string;
}

export const LeagueSchema = SchemaFactory.createForClass(League);
