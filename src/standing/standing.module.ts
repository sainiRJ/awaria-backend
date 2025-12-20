import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Standing, StandingSchema } from './schemas/standing.schema';
import { Team, TeamSchema } from 'src/team/schemas/team.schema';
import { StandingService } from './standing.service';
import { StandingController } from './standing.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Standing.name, schema: StandingSchema }, { name: Team.name, schema: TeamSchema }])],
  controllers: [StandingController],
  providers: [StandingService],
})
export class StandingModule { }
