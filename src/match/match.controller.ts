import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common';
import { MatchService } from './match.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get('all/:teamId')
  async getUpcomingMatches(@Param('teamId') teamId: string) {
    return this.matchService.getUpcomingMatchesByTeamId(teamId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('next/:teamId')
  async getNextMatche(@Param('teamId') teamId: string) {
    return this.matchService.getNextMatch(teamId);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('post-match/:teamId')
  async getPostMatch(@Param('teamId') teamId: string) {
    const teamIdNumber = parseInt(teamId);
    return this.matchService.getOpponentTeams(teamIdNumber);
  }

  @Post('post-match-feature')
  async getPostMatchFeature(
    @Body() body: { teamId: string; opponentTeamId: string },
  ) {
    const teamIdNumber = parseInt(body.teamId);
    const opponentTeamIdNumber = parseInt(body.opponentTeamId);
    return this.matchService.getLatestFixtureAndInterview(
      teamIdNumber,
      opponentTeamIdNumber,
    );
  }
}
