import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoachModule } from './coach/coach.module';
import {LeagueModule} from './league/league.module'
import { WeatherModule } from './weather/weather.module'
import { TeamModule} from './team/team.module' 
import { ConfigModule } from '@nestjs/config';
import { ClubModule } from './club/club.module';
import { StandingModule } from './standing/standing.module';
import { PlayerModule } from './player/player.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { RefereeFeeModule } from './referee-fee/referee-fee.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/',
    ),
    CoachModule,
    LeagueModule,
    WeatherModule,
    TeamModule,
    ClubModule,
    StandingModule,
    PlayerModule,
    AuthModule,
    MatchModule,
    RefereeFeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
