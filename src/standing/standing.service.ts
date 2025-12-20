import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Standing, StandingDocument } from './schemas/standing.schema';
import { Team, TeamDocument } from '../team/schemas/team.schema';

@Injectable()
export class StandingService {
    constructor(
        @InjectModel(Standing.name) private standingModel: Model<StandingDocument>,
        @InjectModel(Team.name) private teamModel: Model<TeamDocument>
    ) { }

    async getStandings(): Promise<any[]> {
        const standings = await this.standingModel.find().lean().exec();
        return this.addTeamNames(standings);
    }

    async getStandingsByTeam(teamId: string): Promise<any[]> {
        // Find the standing entry that matches the teamId
        const teamStanding = await this.standingModel.findOne({ team_id: teamId }).lean().exec();
        if (!teamStanding) {
            throw new NotFoundException('Team not found in standings');
        }

        // Extract tournamentId
        const { tournament_id } = teamStanding;

        // Retrieve all standings for the tournamentId
        const standings = await this.standingModel.find({ tournament_id }).lean().exec();

        // Attach team names
        return this.addTeamNames(standings);
    }

    private async addTeamNames(standings: any[]): Promise<any[]> {
        const teamIds = standings.map(s => s.team_id);
        const teams = await this.teamModel.find({ _id: { $in: teamIds } }).lean().exec();

        // Convert teams to a map for quick lookup
        const teamMap = teams.reduce((acc, team) => {
            acc[team._id] = team.team_name;
            return acc;
        }, {} as Record<number, string>);

        // Add team names to standings
        return standings.map(s => ({
            ...s,  
            team_name: teamMap[s.team_id] || 'Unknown'
        }));
    }
}
