import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ collection: 'Event' })
export class Event {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  event_title: string;

  @Prop({ required: true })
  league_id: number;

  @Prop({ required: true })
  status: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
