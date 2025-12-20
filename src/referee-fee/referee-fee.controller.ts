import { Controller, Get, Query, HttpCode, UseGuards } from '@nestjs/common';
import { RefereeFeeService } from './referee-fee.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('referee-fees')
export class RefereeFeeController {
  constructor(private readonly refereeFeeService: RefereeFeeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async getFee(
    @Query('league') league: string,
    @Query('ageGroup') ageGroup: string,
    @Query('location') location: string,
    @Query('isCupGame') isCupGame: string
  ) {
    const isCup = isCupGame === 'true';
    return this.refereeFeeService.getRefereeFee(league, ageGroup, location, isCup);
  }
}
