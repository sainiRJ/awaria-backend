import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefereeFeeDocument = RefereeFee & Document;


@Schema()
export class RefereeFee {
  @Prop({ required: true })
  league: string;

  @Prop({ required: true })
  age_group: string;

  @Prop({ required: true })
  standard_fee: string;

  @Prop({ required: true })
  westchester_fee: string;

  @Prop({ required: true })
  cup_game_fee: string;

  @Prop({ required: true })
  wysl_fee: string;
}

export const RefereeFeeSchema = SchemaFactory.createForClass(RefereeFee);