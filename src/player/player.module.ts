import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Team,TeamSchema } from 'src/team/schemas/team.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema },{name:Team.name,schema:TeamSchema}])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
