import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamContactInformationDocument = TeamContactInformation & Document;

@Schema({ collection: 'Team_Contact_Information' })
export class TeamContactInformation {
    @Prop({ required: true })
    teamId: string;
    
  @Prop()
  Title: string; // Matches "Team Name" from DB

  @Prop()
  Name: string;

  @Prop()
  Email: string;

  @Prop()
  Phone: string;
}

export const TeamContactInformationSchema = SchemaFactory.createForClass(TeamContactInformation);