import { Controller, Get } from '@nestjs/common';
import { ClubService } from './club.service';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  async getClubs() {
    return this.clubService.getClubs();
  }
}
