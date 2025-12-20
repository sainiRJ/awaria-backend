import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { League, LeagueSchema } from '../league/schemas/league.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: League.name, schema: LeagueSchema }
    ])
  ],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
