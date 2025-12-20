import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MlFixtureProdDocument = MlFixtureProd & Document;

@Schema({ collection: 'ml-fixtures-prod' })
export class MlFixtureProd {
  @Prop({ required: true })
  fixture_id: number;

  @Prop({ required: true })
  league_name: string;

  @Prop({ required: true })
  season: string;

  @Prop({ required: true })
  match_status: string;

  @Prop({ required: true })
  match_type: string;

  @Prop({ required: true })
  match_time: Date;

  @Prop({ required: true })
  match_location: string;

  @Prop({ required: true })
  venue_name: string;

  @Prop({ required: true, type: Object })
  home_team: {
    team_id: number;
    team_name: string;
    club_name: string;
    club_website: string;
    age_group: string;
    bracket: string;
    division: string;
    gender: string;
    score: number;
  };

  @Prop({ required: true, type: Object })
  away_team: {
    team_id: number;
    team_name: string;
    club_name: string;
    club_website: string;
    age_group: string;
    bracket: string;
    division: string;
    gender: string;
    score: number;
  };

  @Prop()
  end_results?: string;
}

export const MlFixtureProdSchema = SchemaFactory.createForClass(MlFixtureProd);
