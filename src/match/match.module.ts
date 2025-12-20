import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { Team, TeamSchema } from '../team/schemas/team.schema';
import {
  MlFixtureProd,
  MlFixtureProdSchema,
} from './schemas/ml-fixture-prod.schema';
import { MlInterview, MlInterviewSchema } from './schemas/ml-interview.schema';

import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([
      { name: MlFixtureProd.name, schema: MlFixtureProdSchema },
    ]),
    MongooseModule.forFeature([
      { name: MlInterview.name, schema: MlInterviewSchema },
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
