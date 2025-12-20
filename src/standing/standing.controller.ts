import { Controller, Get, HttpCode, Param} from '@nestjs/common';
import { StandingService } from './standing.service';

@Controller('standing')
export class StandingController {
  constructor(private readonly standingService: StandingService) {}

  @Get()
@HttpCode(200) 
  async getStandings() {
    return this.standingService.getStandings();
  }

  @Get(':teamId')
  @HttpCode(200)
  async getStandingsByTeam(@Param('teamId') teamId: string) {
    return this.standingService.getStandingsByTeam(teamId);
  }
}
