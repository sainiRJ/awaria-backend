import { Controller, Get } from '@nestjs/common';
import { LeagueService } from './league.service';

@Controller('leagues')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Get()
  async getLeagues() {
    return this.leagueService.getLeagues();
  }
}
