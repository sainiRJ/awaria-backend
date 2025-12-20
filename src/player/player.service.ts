import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Team,TeamDocument} from 'src/team/schemas/team.schema';
import { UpdatePlayerDto } from './dto/update-player.dto';
@Injectable()
export class PlayerService {
  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>,@InjectModel(Team.name) private teamModel:Model<TeamDocument>) {}

  async getPlayersByTeamId(teamId: string): Promise<Player[]> {
    const team_id = parseInt(teamId)
    const players = await this.playerModel
    .find({ team_id: team_id })
    .populate({
      path: 'alternative_options',
      select: 'player_number name', // Retrieve player_number
    })
    .exec();

    if (!players.length) {
      throw new NotFoundException(`No players found for teamId: ${teamId}`);
    }

     // Regex to extract text inside parentheses
     const parenthesisRegex = /\((.*?)\)/;
     // Process each player and add `alternate_position`
    const processedPlayers = players.map(player => {
      const match = player.awareia_insight?.match(parenthesisRegex);
      return {
          ...player.toObject(), // Convert Mongoose document to plain object
          alternate_position: match ? match[1] : null, // Extract text inside ()
      };
  });

  return processedPlayers;

  }

async createPlayer(Player:CreatePlayerDto){
      try{
    const teamId=parseInt(Player.team_id.toString());
    const team= await this.teamModel.findOne({_id: teamId});

    if(!team){
      throw new BadRequestException(`No team found for teamId: ${teamId}`);
    }

    const existPlayer=await this.playerModel.findOne({player_number:Player.player_number,team_id:Player.team_id});
    if(existPlayer){
       
        throw new BadRequestException('Player already exist with number'+Player.player_number);
    }

    const player = new this.playerModel(Player);
    return await player.save();
  }catch(error){
    console.log(error);
        throw new BadRequestException('Error on create player : ',error.message);
  }  
  }

  async getPlayerStatus(teamId: string) {
    if (!teamId) {
      return { message: "teamId is required" };
    }

    const totalPlayers = await this.playerModel.countDocuments({ teamId });

    const statusData = await this.playerModel.aggregate([
      { $match: { teamId } },  // Filter by teamId
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          players: { $push: "$name" }
        }
      }
    ]);

    const response = {
      totalPlayers,
      status: {}
    };

    statusData.forEach(status => {
      response.status[status._id] = {
        totalCount: status.count,
        players: status.players
      };
    });

    return response;
  }

  async updateStatus(playerData: UpdatePlayerDto) {
    try {
      const { playerId, status, expectedReturnDate } = playerData;
  
      const player = await this.playerModel.findById(playerId);
      if (!player) {
        throw new BadRequestException(`Player not found with id: ${playerId}`);
      }
  
      const statusesRequiringReturnDate = ['injured', 'suspended', 'unavailable'];
  
      if (status) {
        player.status = status;
  
        if (!statusesRequiringReturnDate.includes(status.toLowerCase())) {
          player.expected_return_date = null;
        }
      }
  
      if (expectedReturnDate) {
        if (statusesRequiringReturnDate.includes(player.status.toLowerCase())) {
          player.expected_return_date = new Date(expectedReturnDate);
        } else {
          player.expected_return_date = null;
        }
      }
  
      await player.save();
  
      return {
        success: true,
        message: "Player status updated successfully."
      };
    } catch (error) {
      throw new BadRequestException("Error updating player status", error.message);
    }
  }
  
}
