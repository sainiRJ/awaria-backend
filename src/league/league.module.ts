import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { League, LeagueSchema } from './schemas/league.schema';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { Team, TeamSchema } from 'src/team/schemas/team.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: League.name, schema: LeagueSchema },
    {name: Team.name, schema: TeamSchema}
  ])],
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
