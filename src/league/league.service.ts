import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { League, LeagueDocument } from './schemas/league.schema';

@Injectable()
export class LeagueService {
    constructor(@InjectModel(League.name) private leagueModel: Model<LeagueDocument>) { }
    async getLeagues(): Promise<{ _id: number; leagueTitle: string }[]> {
        const leagues = await this.leagueModel.find().exec();
        return leagues
      }      
}
