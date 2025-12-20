import { Controller, Get, Param, HttpCode,   UseGuards, Req, Res, Post, Body, HttpStatus } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Get('team/:teamId')
  @HttpCode(200)  
  async getPlayers(@Param('teamId') teamId: string) {
    return this.playerService.getPlayersByTeamId(teamId);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('status/:teamId')
  async getPlayerStatus(@Param('teamId') teamId: string) {
    return this.playerService.getPlayerStatus(teamId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('changestatus')
  async changeStatus(@Body() playerData: UpdatePlayerDto){
      return this.playerService.updateStatus(playerData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("create")
  async createPlayer(@Body() createPlayerDto:CreatePlayerDto){       
      return  this.playerService.createPlayer(createPlayerDto);
  }

}

