import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventCLubDocument = EventCLub & Document;

@Schema({ collection: 'Event_Club' })
export class EventCLub {

  @Prop({ required: true })
  club_id: number;

  @Prop({ required: true })
  event_id: number;
}

export const EventCLubSchema = SchemaFactory.createForClass(EventCLub);
