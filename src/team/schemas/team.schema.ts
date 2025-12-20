import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ collection: 'Team' })
export class Team {
    @Prop({ required: true })
    _id: number;

  @Prop()
  gender: string;

  @Prop()
  age: string;

  @Prop()
  club_id: number;

  @Prop()
  division: string;  
  
  @Prop()
  team_name: string;

    
  @Prop()
  bracket: string;
  
}

export const TeamSchema = SchemaFactory.createForClass(Team);