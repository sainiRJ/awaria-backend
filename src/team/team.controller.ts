import { Controller, Get } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeams() {
    return this.teamService.getTeams();
  }
  @Get('age')
  async getAges() {
    return this.teamService.getAges();
  }
}
