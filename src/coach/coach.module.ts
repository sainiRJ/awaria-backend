import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachController } from './coach.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coach, CoachSchema } from './schemas/coach.schema';
import { Team, TeamSchema } from '../team/schemas/team.schema';
import { CoachTeam, CoachTeamSchema } from './schemas/coach-team.schema';
import {TeamContactInformation, TeamContactInformationSchema} from '../team-contact-information/schemas/team-contact-information.schema'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../auth/jwt.strategy';
import { League, LeagueSchema } from 'src/league/schemas/league.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coach.name, schema: CoachSchema }]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: TeamContactInformation.name, schema: TeamContactInformationSchema }]),
    MongooseModule.forFeature([{ name: CoachTeam.name, schema: CoachTeamSchema }]),
    MongooseModule.forFeature([{name:League.name,schema:LeagueSchema}]),
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [CoachController],
  providers: [CoachService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class CoachModule {}
