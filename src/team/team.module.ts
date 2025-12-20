import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Event, EventSchema } from 'src/event/schemas/event.schema';
import { EventCLub, EventCLubSchema } from 'src/event/schemas/event-club.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Team.name, schema: TeamSchema },
    { name: Event.name, schema: EventSchema },
    { name: EventCLub.name, schema: EventCLubSchema },
  ]),],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
