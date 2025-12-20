import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClubDocument = Club & Document;

@Schema({ collection: 'Club' })
export class Club {

    @Prop({ required: true })
    _id: string;
    
  @Prop()
  club_name: string; // Matches "Club Name" from DB

  @Prop()
  club_website: string;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
